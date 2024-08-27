import React, { useEffect, useState } from "react";

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
    pickupDate: booking.start.split('T')[0],
    returnDate: booking.end.split('T')[0],
    pickupTime: booking.start.split('T')[1],
    returnTime: booking.end.split('T')[1],
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

    console.log(booking);
    

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
        <form onSubmit={handleSubmit} className="rental-form">
          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Дата получения</label>
              <input
                type="date"
                name="pickupDate"
                value={formData.pickupDate}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
            <div className="rental-form__col">
              <label className="rental-form__label">Дата возврата</label>
              <input
                type="date"
                name="returnDate"
                value={formData.returnDate}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Время получения</label>
              <input
                type="time"
                name="pickupTime"
                value={formData.pickupTime}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
            <div className="rental-form__col">
              <label className="rental-form__label">Время возврата</label>
              <input
                type="time"
                name="returnTime"
                value={formData.returnTime}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Локация</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Страна</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
            <div className="rental-form__col">
              <label className="rental-form__label">Город</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Клиент</label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
            <div className="rental-form__col">
              <label className="rental-form__label">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="rental-form__input"
                required
              />
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="telegram"
                  checked={formData.telegram}
                  onChange={handleChange}
                  className="rental-form__checkbox"
                />
                Telegram
              </label>
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="whatsapp"
                  checked={formData.whatsapp}
                  onChange={handleChange}
                  className="rental-form__checkbox"
                />
                WhatsApp
              </label>
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="viber"
                  checked={formData.viber}
                  onChange={handleChange}
                  className="rental-form__checkbox"
                />
                Viber
              </label>
            </div>
            <div className="rental-form__col">
              <input
                type="tel"
                name="additionalPhone"
                value={formData.additionalPhone}
                onChange={handleChange}
                className="rental-form__input"
                placeholder="Доп. Телефон"
              />
            </div>
          </div>

          <div className="rental-form__row">
            <label className="rental-form__label">Примененный коэфф.</label>
            <input
              type="text"
              name="coefficient"
              value={formData.coefficient}
              readOnly
              className="rental-form__input"
            />
          </div>

          <div className="rental-form__row">
            <label className="rental-form__label">К оплате</label>
            <input
              type="text"
              name="amountDue"
              value={formData.amountDue + " $"}
              readOnly
              className="rental-form__input rental-form__input--currency"
            />
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__subtitle">
                Дополнительные услуги
              </label>
              <div className="rental-form__row">
                <input
                  type="text"
                  name="searchService"
                  className="rental-form__input rental-form__input--search"
                  placeholder="Поиск..."
                />
                <button
                  type="button"
                  className="btn rental-form__button rental-form__button--search">
                  НАЙТИ
                </button>
              </div>
            </div>
          </div>

          <div className="rental-form__row">
            <div className="rental-form__col">
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="driver"
                  checked={formData.additionalServices.driver}
                  onChange={handleServiceChange}
                  className="rental-form__checkbox"
                />
                Водитель
              </label>
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="transfer"
                  checked={formData.additionalServices.transfer}
                  onChange={handleServiceChange}
                  className="rental-form__checkbox"
                />
                Трансфер
              </label>
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="childSeat"
                  checked={formData.additionalServices.childSeat}
                  onChange={handleServiceChange}
                  className="rental-form__checkbox"
                />
                Детское кресло
              </label>
              <label className="rental-form__label rental-form__label--checkbox">
                <input
                  type="checkbox"
                  name="bluetoothHeadset"
                  checked={formData.additionalServices.bluetoothHeadset}
                  onChange={handleServiceChange}
                  className="rental-form__checkbox"
                />
                Bluetooth гарнитура
              </label>
            </div>
          </div>

          <div className="rental-form__row">
            <button
              type="submit"
              className="btn rental-form__button rental-form__button--save">
              СОХРАНИТЬ
            </button>
          </div>
        </form>
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
