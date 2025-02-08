import React from "react";

const Listing = ({ model, onPurchase, onRate, onDelete }) => {
  const handlePurchase = async () => {
    try {
      await onPurchase(model.id, model.price);
    } catch (error) {
      console.error("Error purchasing model:", error);
      alert("Failed to purchase the model. Check the console for details.");
    }
  };

  const handleRate = async (rating) => {
    try {
      await onRate(model.id, rating);
    } catch (error) {
      console.error("Error rating model:", error);
      alert("Failed to rate the model. Check the console for details.");
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await onDelete(model.id);
      } catch (error) {
        console.error("Error deleting listing:", error);
        alert("Failed to delete listing. Check the console for details.");
      }
    }
  };

  return (
    <div className="listing" style={{ border: "1px solid #ccc", padding: "16px", margin: "16px 0" }}>
      <h3>{model.name}</h3>
      <p><strong>Description:</strong> {model.description}</p>
      <p><strong>Price:</strong> {model.price} UGT</p>
      {/* Добавлен класс "seller" и атрибут title для обрезки длинного адреса */}
      <p className="seller" title={model.seller}>
        <strong>Seller:</strong> {model.seller}
      </p>

      {/* Отображение статуса листинга */}
      {model.isDeleted ? (
        <p style={{ color: "gray" }}>This listing has been deleted.</p>
      ) : (
        <>
          {model.isSold ? (
            <p style={{ color: "red" }}>Model already sold</p>
          ) : (
            <button onClick={handlePurchase} style={{ marginRight: "8px" }}>
              Purchase
            </button>
          )}
          {onDelete && !model.isSold && (
            <button
              onClick={handleDelete}
              style={{
                marginRight: "8px",
                backgroundColor: "orange",
                color: "#fff",
                border: "none",
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer"
              }}
            >
              Delete Listing
            </button>
          )}
        </>
      )}

      {/* Отображение рейтинга */}
      <div>
        <h4>Rating:</h4>
        <p>
          <strong>Average Rating:</strong> {model.rating} (based on {model.ratingCount} ratings)
        </p>
      </div>

      {/* Блок для оценки модели */}
      <div>
        <h4>Rate this model:</h4>
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            onClick={() => handleRate(rating)}
            style={{
              margin: "4px",
              padding: "4px 8px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            {rating}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Listing;
