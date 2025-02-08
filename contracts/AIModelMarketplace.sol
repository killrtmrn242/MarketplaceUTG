// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AIMarketplace {
    struct Model {
        uint256 id;
        string name;
        string description;
        uint256 price;      // Цена в токенах UGT
        address seller;
        string fileLink;    // Ссылка на файл модели (или IPFS хэш)
        bool isSold;        // Флаг, указывающий, что модель продана
        bool isDeleted;     // Флаг, указывающий, что листинг удалён
        uint256 rating;     // Средний рейтинг модели (например, в диапазоне 1-5)
        uint256 ratingCount; // Количество оценок
    }

    uint256 public modelCount;
    mapping(uint256 => Model) public models;

    IERC20 public token; // Ваш ERC20 токен (UGT)

    // События для отслеживания действий
    event ModelCreated(uint256 indexed id, address indexed seller);
    event ModelPurchased(uint256 indexed id, address indexed buyer);
    event ModelDeleted(uint256 indexed id);
    event ModelRated(uint256 indexed id, uint256 rating, address indexed rater);

    constructor(address _tokenAddress) {
        token = IERC20(_tokenAddress);
    }

    // Создание нового листинга
    function createListing(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _fileLink
    ) public {
        require(_price > 0, "Price must be greater than 0");
        modelCount++;
        models[modelCount] = Model({
            id: modelCount,
            name: _name,
            description: _description,
            price: _price,
            seller: msg.sender,
            fileLink: _fileLink,
            isSold: false,
            isDeleted: false,
            rating: 0,
            ratingCount: 0
        });
        emit ModelCreated(modelCount, msg.sender);
    }

    // Покупка модели
    function purchaseModel(uint256 _id) public {
        require(_id > 0 && _id <= modelCount, "Invalid model ID");
        Model storage model = models[_id];
        require(!model.isDeleted, "Listing is deleted");
        require(!model.isSold, "Model already sold");

        require(
            token.transferFrom(msg.sender, model.seller, model.price),
            "Token transfer failed"
        );

        model.isSold = true;
        emit ModelPurchased(_id, msg.sender);
    }

    // Удаление листинга (только продавец и только если модель ещё не продана)
    function deleteListing(uint256 _id) public {
        require(_id > 0 && _id <= modelCount, "Invalid model ID");
        Model storage model = models[_id];
        require(msg.sender == model.seller, "Only seller can delete listing");
        require(!model.isSold, "Cannot delete a sold model");
        require(!model.isDeleted, "Listing already deleted");
        model.isDeleted = true;
        emit ModelDeleted(_id);
    }

    // Оценка модели
    function rateModel(uint256 _id, uint256 _rating) public {
        require(_id > 0 && _id <= modelCount, "Invalid model ID");
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[_id];
        require(!model.isDeleted, "Listing is deleted");
        // Можно разрешить оценивать проданную модель или нет, по вашему усмотрению.
        // Если оценивать проданную модель не нужно, добавьте: require(!model.isSold, "Cannot rate a sold model");

        // Обновляем средний рейтинг:
        uint256 totalRating = model.rating * model.ratingCount;
        totalRating += _rating;
        model.ratingCount++;
        model.rating = totalRating / model.ratingCount;

        emit ModelRated(_id, _rating, msg.sender);
    }

    // Получение информации о модели
    function getModel(uint256 _id)
        public
        view
        returns (
            uint256,
            string memory,
            string memory,
            uint256,
            address,
            string memory,
            bool,
            bool,
            uint256,
            uint256
        )
    {
        Model memory model = models[_id];
        return (
            model.id,
            model.name,
            model.description,
            model.price,
            model.seller,
            model.fileLink,
            model.isSold,
            model.isDeleted,
            model.rating,
            model.ratingCount
        );
    }

    // Получение количества моделей
    function getModelsCount() public view returns (uint256) {
        return modelCount;
    }
}
