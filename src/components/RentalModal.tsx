import React, { useEffect, useState } from "react";
import RentalForm from "./RentalForm";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  rent: any;
  vehicle: {
    id: number;
    name: string;
    type: string;
    class: string;
    brand: string;
    model: string;
    engine_type: string;
    edit_url: string;
  } | null;
}

const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  rent,
  vehicle,
}) => {
  const [formData, setFormData] = useState({
    pickupDate: new Date(rent.start_date).toISOString().split("T")[0],
    returnDate: new Date(rent.end_date).toISOString().split("T")[0],
    pickupTime: new Date(rent.start_date)
      .toISOString()
      .split("T")[1]
      .slice(0, 5),
    returnTime: new Date(rent.end_date).toISOString().split("T")[1].slice(0, 5),
    location: rent.city,
    country: rent.country,
    city: rent.city,
    clientName: rent.client_name,
    email: rent.email,
    phone: rent.tel,
    additionalPhone: rent.tel_2,
    telegram: rent.socials?.Telegram || false,
    whatsapp: rent.socials?.Whatsapp || false,
    viber: rent.socials?.Viber || false,
    coefficient: rent.payment_koeff.toFixed(2) || 0,
    amountDue: rent.payable.toFixed(2) || 0,
    currency: rent.currency || "",
    additionalServices: {
      driver: false,
      transfer: false,
      childSeat: false,
      bluetoothHeadset: false,
    },
  });

  console.log(vehicle);

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

  const handleSubmit = () => {
    console.log("Form data:", formData);
    onClose();
  };

  const handleConfirmClose = (action: "save" | "discard" | "cancel") => {
    if (action === "save") {
      handleSubmit();
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
          {vehicle ? (
            <h3 className="modal__subtitle">{vehicle.name}</h3>
          ) : (
            <h3 className="modal__subtitle">
              Информация о транспорте не доступна
            </h3>
          )}
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
