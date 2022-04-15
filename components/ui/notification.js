import NotificationContext from "../../store/notification-context";
// import classNames from "classnames";
import { useContext } from "react";

const statusStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  pending: "bg-blue-700",
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Notification = (props) => {
  const notificationCtx = useContext(NotificationContext);
  const { title, message, status } = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = statusStyles.success;
  }

  if (status === "error") {
    statusClasses = statusStyles.error;
  }

  if (status === "pending") {
    statusClasses = statusStyles.pending;
  }

  return (
    <>
      <div
        className={classNames(
          "flex fixed bottom-0 left-0 h-20 w-full  justify-between items-center text-white py-10 shadow-3xl rounded-tr-none rounded-tl-none",
          statusClasses
        )}
      >
        <h2 className="px-10 text-xl text-white">{title}</h2>
        <p className="px-10">{message}</p>
      </div>
    </>
  );
};

export default Notification;
