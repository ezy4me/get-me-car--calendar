import React, { useEffect, useState } from "react";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

const RentalModal: React.FC<RentalModalProps> = ({ isOpen, onClose, booking }) => {
  const [formData, setFormData] = useState({
    pickupDate: "",
    returnDate: "",
    pickupTime: "",
    returnTime: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      additionalServices: {
        ...prev.additionalServices,
        [name]: checked,
      },
    }));
  };

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
      className={`custom-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}>
      <div className="custom-modal">
        <div className="modal-header">
          <h2>КАРТОЧКА АРЕНДЫ</h2>
          <h3>{booking.transportName}</h3>
          <button onClick={onModalClose} className="close-button">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Дата получения</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Дата возврата</label>
            <input
              type="date"
              name="returnDate"
              value={formData.returnDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Время получения</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Время возврата</label>
            <input
              type="time"
              name="returnTime"
              value={formData.returnTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Локация</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Страна</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Город</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Клиент</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="telegram"
                checked={formData.telegram}
                onChange={handleChange}
              />
              Telegram
            </label>
            <input
              type="tel"
              name="additionalPhone"
              value={formData.additionalPhone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="whatsapp"
                checked={formData.whatsapp}
                onChange={handleChange}
              />
              WhatsApp
            </label>
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="viber"
                checked={formData.viber}
                onChange={handleChange}
              />
              Viber
            </label>
          </div>
          <div className="form-group">
            <label>Примененный коэфф.</label>
            <input
              type="text"
              name="coefficient"
              value={formData.coefficient}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>К оплате</label>
            <input
              type="text"
              name="amountDue"
              value={formData.amountDue}
              readOnly
            />
            <span>$</span>
          </div>
          <div className="form-group">
            <label>Дополнительные услуги</label>
            <div className="services">
              <label>
                <input
                  type="checkbox"
                  name="driver"
                  checked={formData.additionalServices.driver}
                  onChange={handleServiceChange}
                />
                Водитель
              </label>
              <label>
                <input
                  type="checkbox"
                  name="transfer"
                  checked={formData.additionalServices.transfer}
                  onChange={handleServiceChange}
                />
                Трансфер
              </label>
              <label>
                <input
                  type="checkbox"
                  name="childSeat"
                  checked={formData.additionalServices.childSeat}
                  onChange={handleServiceChange}
                />
                Детское кресло
              </label>
              <label>
                <input
                  type="checkbox"
                  name="bluetoothHeadset"
                  checked={formData.additionalServices.bluetoothHeadset}
                  onChange={handleServiceChange}
                />
                Bluetooth гарнитура
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Поиск дополнительной услуги</label>
            <input type="text" name="searchService" placeholder="ПОЛЕ_ПОИСКА" />
            <button type="button" className="search-button">
              НАЙТИ
            </button>
          </div>
          <div className="form-group">
            <button type="submit" className="save-button">
              СОХРАНИТЬ
            </button>
          </div>
        </form>
      </div>
      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Есть несохраненные изменения</h3>
            <p>Вы хотите сохранить изменения?</p>
            <button className="btn" onClick={() => handleConfirmClose("save")}>
              Сохранить
            </button>
            <button className="btn" onClick={() => handleConfirmClose("discard")}>
              Выйти без сохранения
            </button>
            <button className="btn" onClick={() => handleConfirmClose("cancel")}>Отмена</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalModal;
