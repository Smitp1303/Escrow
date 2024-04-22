import "../App.css";


export default function Escrow({
  address,
  broker,
  beneficiary,
  value,
  timelock,
  handleApprove,
  handleDelete,
}) {
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Broker </div>
          <div> {broker} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {value} </div>
        </li>
        <li>
          <div> Timelock </div>
          <div> {timelock} seconds </div>
        </li>
        <div className="button-container">
          <div
            className="button approve-button"
            id={address}
            onClick={(event) => {
              event.preventDefault();
              handleApprove();
            }}
          >
            Approve Transfer of Funds
          </div>
          <div
            className="button delete-button"
            id="Checked"
            onClick={(event) => {
              event.preventDefault();
              handleDelete();
            }}
          >
            Delete Contract
          </div>
        </div>
      </ul>
    </div>
  );
}
