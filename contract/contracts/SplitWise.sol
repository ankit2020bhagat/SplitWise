// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SplitWise Contract
 * @notice A smart contract for splitting expenses among contributors
 */
contract SplitWise is ReentrancyGuard, AccessControl {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private id;

    // Error messages
    error UnAuthorise();
    error InvalidAddress();
    error TranasctionFailed();
    error InsufficientFunds();

    struct Expense {
        string purpose;
        uint256 amount;
        address vendor;
        address payer;
    }

    struct Contributor {
        string name;
        bool isVerified;
        uint lend;
        uint borrow;
    }

    mapping(uint256 id => Expense) public expenses;
    mapping(address payer => mapping(address user => Contributor))
        public contributors;
    mapping(address user => Contributor) public addWhiteList;
    address[] contributor;

    event AddExpenses(
        uint indexed id,
        uint indexed amount,
        address indexed payer,
        address vendor,
        string purpose
    );

    event MakePayment(
        address indexed from,
        uint indexed amount,
        address[] indexed user
    );

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(DEFAULT_ADMIN_ROLE, DEFAULT_ADMIN_ROLE);
    }

    // Ensure the caller is a verified contributor
    modifier onlyContributor() {
        Contributor memory m_contributor = addWhiteList[msg.sender];
        if (!m_contributor.isVerified) {
            revert UnAuthorise();
        }
        _;
    }

    // Ensure the address is not zero
    modifier isValidAddress(address _user) {
        if (_user == address(0)) {
            revert InvalidAddress();
        }
        _;
    }

    /**
     * @notice Add contributors with verified status
     * @dev Only the contract's admin can add contributors
     * @param user The address of the contributor to add
     * @param _name The name of the contributor
     */
    function addContributors(
        address user,
        string calldata _name
    ) external onlyRole(DEFAULT_ADMIN_ROLE) isValidAddress(user) {
        Contributor storage s_contributor = addWhiteList[user];
        s_contributor.name = _name;
        s_contributor.isVerified = true;
        contributor.push(user);
    }

    /**
     * @notice Add expenses and split them among contributors
     * @dev Only verified contributors can add expenses
     * @param _purpose The purpose or description of the expenses
     * @param _amount The total amount of the expenses
     * @param _contributor An array of contributor addresses involved in the expenses
     * @param _vendor The address of the vendor receiving the payment
     */
    function addExpenses(
        string calldata _purpose,
        uint _amount,
        address[] calldata _contributor,
        address _vendor
    ) external payable nonReentrant onlyContributor {
        if (msg.value < _amount) {
            revert InsufficientFunds();
        }
        uint256 _id = id.current();
        Expense storage s_expenses = expenses[_id];
        s_expenses.purpose = _purpose;
        s_expenses.amount = _amount;
        s_expenses.vendor = _vendor;
        (bool success, ) = _vendor.call{value: msg.value}("");
        if (!success) {
            revert InsufficientFunds();
        }
        s_expenses.payer = msg.sender;
        uint256 cost = _amount / (_contributor.length + 1);
        _makeSettlement(_contributor, cost);
        id.increment();
        emit AddExpenses(_id, _amount, msg.sender, _vendor, _purpose);
    }

    /**
     * @notice Make settlements for the expenses among contributors
     * @param _contributor An array of contributor addresses involved in the expenses
     * @param cost The cost to be split among the contributors
     */
    function _makeSettlement(
        address[] calldata _contributor,
        uint cost
    ) internal {
        Contributor memory p_whileList = addWhiteList[msg.sender];
        for (uint8 i = 0; i < _contributor.length; i++) {
            Contributor storage c_contributor = contributors[_contributor[i]][
                msg.sender
            ];
            Contributor memory c_whileList = addWhiteList[_contributor[i]];
            Contributor storage p_contributor = contributors[msg.sender][
                _contributor[i]
            ];
            p_contributor.name = p_whileList.name;
            c_contributor.name = c_whileList.name;
            c_contributor.isVerified = c_whileList.isVerified;
            uint _lend = c_contributor.lend;

            if (_lend > 0) {
                if (cost > _lend) {
                    c_contributor.lend = 0;

                    p_contributor.borrow = 0;

                    uint remain = cost - _lend;
                    c_contributor.borrow += remain;

                    p_contributor.lend += remain;
                } else {
                    c_contributor.lend -= cost;

                    p_contributor.borrow -= cost;
                }
            } else {
                c_contributor.borrow += cost;

                p_contributor.lend += cost;
            }
            console.log(
                msg.sender,
                "lend",
                _contributor[i],
                p_contributor.lend
            );
            console.log(
                msg.sender,
                "borrow ",
                _contributor[i],
                p_contributor.borrow
            );
        }
    }

    /**
     * @notice Make a payment to settle outstanding balances
     */
    function makePayment() external payable nonReentrant onlyContributor {
        (, , uint lend) = getDetails();
        if (msg.value < lend) {
            revert InsufficientFunds();
        }
        uint length = contributor.length;
        for (uint i = 0; i < length; i++) {
            Contributor storage p_contributor = contributors[msg.sender][
                contributor[i]
            ];
            Contributor storage c_contributor = contributors[contributor[i]][
                msg.sender
            ];
            uint _borrow = p_contributor.borrow;
            if (_borrow > 0) {
                (bool success, ) = contributor[i].call{value: _borrow}("");
                if (!success) {
                    revert TranasctionFailed();
                }
                p_contributor.borrow = 0;
                c_contributor.lend = 0;
            }
        }
        emit MakePayment(msg.sender, msg.value, contributor);
    }

    /**
     * @notice Get contributor details including owed and lent amounts
     * @
     * @return _lend The total amount owed by the contributor
     * @return _borrow The total amount lent by the contributor
     */
    function getDetails()
        public
        view
        returns (Contributor[] memory, uint, uint)
    {
        uint length = contributor.length;
        uint _lend;
        uint _borrow;
        uint currentIndex = 0;
        Contributor[] memory _contributor = new Contributor[](length - 1);
        for (uint8 i = 0; i < length; i++) {
            Contributor memory p_contributor = contributors[msg.sender][
                contributor[i]
            ];
            if (p_contributor.lend > 0 || p_contributor.borrow > 0) {
                Contributor memory c_contributor = contributors[contributor[i]][
                    msg.sender
                ];

                _contributor[currentIndex] = c_contributor;
                currentIndex += 1;
            }
            _lend += p_contributor.lend;

            _borrow += p_contributor.borrow;
        }
        return (_contributor, _lend, _borrow);
    }

    /**
     * @dev Overrides the internal checkRole function to include custom access control logic
     * @param role The role to check
     * @param account The account to check against the role
     */
    function _checkRole(
        bytes32 role,
        address account
    ) internal view virtual override {
        if (!(hasRole(role, account) || hasRole(DEFAULT_ADMIN_ROLE, account))) {
            revert UnAuthorise();
        }
    }
}
