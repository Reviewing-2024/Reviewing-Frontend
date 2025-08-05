import "../../../assert/css/deletecard.css";

const DeleteCard = ({ onCancel, onConfirm, review }) => {
  return (
    <div className="deletemodal-backdrop">
      <div className="deletemodal-window">
        <p>정말로 리뷰를 삭제하시겠습니까?</p>
        <div className="deletemodal-buttons">
          <button className="deletemodal-buttons-cancel" onClick={onCancel}>아니요</button>
          <button className="deletemodal-buttons-confirm" onClick={onConfirm}>네</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCard;
