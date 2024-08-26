import React, { useEffect, useState } from "react";

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RentalModal: React.FC<RentalModalProps> = ({ isOpen, onClose }) => {
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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

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

  if (!isOpen) return null;

  return (
    <div
      className={`custom-modal-overlay ${isOpen ? "open" : ""}`}
      onClick={handleOverlayClick}>
      <div className="custom-modal">
        <div className="modal-header">
          <h2>КАРТОЧКА АРЕНДЫ</h2>
          <button onClick={onClose} className="close-button">
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
    </div>
  );
};

export default RentalModal;
