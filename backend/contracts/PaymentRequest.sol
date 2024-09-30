// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IDiaOracle {
    function getValue(string memory key) external view returns (uint128, uint128);
}


contract PaymentRequest is ReentrancyGuard {
    IERC20 public xfiToken;
    IDiaOracle public diaOracle;

    struct Request {
        address payable recipient;
        uint256 amount;
        string description;
        uint256 expiration;
        bool paid;
        uint256 xfiPriceAtCreation;
    }

    struct User {
        uint256 stakedAmount;
        uint256 lastStakeTime;
        bool isPremium;
    }

    mapping(bytes32 => Request) public requests;
    mapping(address => User) public users;

    uint256 public constant PREMIUM_STAKE_AMOUNT = 1000 * 10**18; // 1000 XFI
    uint256 public constant PREMIUM_STAKE_TIME = 30 days;

    event RequestCreated(bytes32 indexed requestId, address recipient, uint256 amount, uint256 xfiPrice);
    event PaymentMade(bytes32 indexed requestId, address payer, uint256 amount, uint256 xfiPrice);
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address _xfiTokenAddress, address _diaOracleAddress) {
        xfiToken = IERC20(_xfiTokenAddress);
        diaOracle = IDiaOracle(_diaOracleAddress);
    }

    function getXFIPrice() public view returns (uint256) {
        (uint128 price, ) = diaOracle.getValue("XFI/USD");
        return uint256(price);
    }

    function createRequest(uint256 _amount, string memory _description, uint256 _expiration) public returns (bytes32) {
        uint256 xfiPrice = getXFIPrice();
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _amount));
        requests[requestId] = Request(payable(msg.sender), _amount, _description, block.timestamp + _expiration, false, xfiPrice);
        emit RequestCreated(requestId, msg.sender, _amount, xfiPrice);
        return requestId;
    }

    function payRequest(bytes32 _requestId) public nonReentrant {
        Request storage request = requests[_requestId];
        require(!request.paid, "Request already paid");
        require(block.timestamp <= request.expiration, "Request has expired");

        uint256 currentXFIPrice = getXFIPrice();
        request.paid = true;
        require(xfiToken.transferFrom(msg.sender, request.recipient, request.amount), "XFI transfer failed");
        emit PaymentMade(_requestId, msg.sender, request.amount, currentXFIPrice);

        // Reward payer with 1% cashback in XFI
        uint256 cashback = request.amount / 100;
        require(xfiToken.transfer(msg.sender, cashback), "Cashback transfer failed");
    }

    function stake(uint256 _amount) public {
        require(_amount > 0, "Stake amount must be greater than 0");
        require(xfiToken.transferFrom(msg.sender, address(this), _amount), "XFI transfer failed");

        users[msg.sender].stakedAmount += _amount;
        users[msg.sender].lastStakeTime = block.timestamp;

        if (users[msg.sender].stakedAmount >= PREMIUM_STAKE_AMOUNT) {
            users[msg.sender].isPremium = true;
        }

        emit Staked(msg.sender, _amount);
    }

    function unstake(uint256 _amount) public nonReentrant {
        require(_amount > 0, "Unstake amount must be greater than 0");
        require(users[msg.sender].stakedAmount >= _amount, "Insufficient staked amount");

        users[msg.sender].stakedAmount -= _amount;
        require(xfiToken.transfer(msg.sender, _amount), "XFI transfer failed");

        if (users[msg.sender].stakedAmount < PREMIUM_STAKE_AMOUNT) {
            users[msg.sender].isPremium = false;
        }

        emit Unstaked(msg.sender, _amount);
    }

    function isPremiumUser(address _user) public view returns (bool) {
        return users[_user].isPremium && (block.timestamp - users[_user].lastStakeTime) >= PREMIUM_STAKE_TIME;
    }
}
