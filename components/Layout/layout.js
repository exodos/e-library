import { useContext } from "react";
import Sidebar from "./sidebar";
import NotificationContext from "../../store/notification-context";
import Notification from "../ui/notification";

const Layout = ({ children }) => {
  const notificationCtx = useContext(NotificationContext);
  const activeNotification = notificationCtx.notification;
  return (
    <>
      <Sidebar>{children}</Sidebar>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </>
  );
};

export default Layout;
