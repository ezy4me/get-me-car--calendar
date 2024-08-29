import React, { useEffect, useState } from "react";
import RentalForm from "./RentalForm";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const [formData, setFormData] = useState({
    pickupDate: booking.start.split("T")[0],
    returnDate: booking.end.split("T")[0],
    pickupTime: booking.start.split("T")[1],
    returnTime: booking.end.split("T")[1],
    location: "",
    country: "",
    city: "",
    clientName: "",
    email: "",
    phone: "",
    additionalPhone: "",
    telegram: false,
    whatsapp: false,
    viber: false,
    coefficient: "1.78",
    amountDue: "230",
    additionalServices: {
      driver: false,
      transfer: false,
      childSeat: false,
      bluetoothHeadset: false,
    },
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const onModalClose = () => {
    setShowConfirm(true);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setShowConfirm(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowConfirm(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!isOpen && !showConfirm) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    onClose();
  };

  const handleConfirmClose = (action: "save" | "discard" | "cancel") => {
    if (action === "save") {
      const formEvent = new Event("submit", {
        cancelable: true,
      }) as unknown as React.FormEvent;
      handleSubmit(formEvent);
    } else if (action === "discard") {
      onClose();
    } else if (action === "cancel") {
      setShowConfirm(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "modal-overlay--open" : ""}`}
      onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">КАРТОЧКА АРЕНДЫ</h2>
          <h3 className="modal__subtitle">{booking.transportName}</h3>
          <button onClick={onModalClose} className="modal__close-button">
            &times;
          </button>
        </div>
        <RentalForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      </div>
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3 className="confirm-modal__title">
              Есть несохраненные изменения
            </h3>
            <p className="confirm-modal__text">
              Вы хотите сохранить изменения?
            </p>
            <button
              className="btn confirm-modal__button confirm-modal__button--save"
              onClick={() => handleConfirmClose("save")}>
              Сохранить
            </button>
            <button
              className="btn confirm-modal__button confirm-modal__button--discard"
              onClick={() => handleConfirmClose("discard")}>
              Выйти без сохранения
            </button>
            <button
              className="btn confirm-modal__button confirm-modal__button--cancel"
              onClick={() => handleConfirmClose("cancel")}>
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalModal;
