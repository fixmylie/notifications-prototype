import React from "react";

const transform = (item) => {
  return {
    key: item.id,
    message: item.body,
    actions: item.actions,
    onClose: () => {
      item.close();
    },
  };
};

export const Snackbar = (props) => {
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = props.notifications.subscribe(
      { channel: "center-notifications", topic: "change" },
      (payload) => {
        const items = payload.notifications.map((item) => {
          const actions = item.actions
            ? item.actions.map((action) => {
                return {
                  label: action.title,
                  onClick() {
                    props.notifications.dispatch(
                      { action: action.action, namespace: item.namespace },
                      action.payload
                    );
                  },
                };
              })
            : undefined;
          return transform({
            ...item,
            actions: actions,
            close: () => {
              props.notifications.remove(item.id);
            },
          });
        });
        console.log(items);
        setNotifications(items);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [props.notifications]);

  return (
    <div>
      <div>
        {notifications.map((notification) => {
          return (
            <div style={{ marginBottom: "10px" }} key={notification.key}>
              <div>{notification.message}</div>
              <div>
                {notification.actions.map((action) => {
                  return (
                    <div key={notification.key + action.label}>
                      <button
                        onClick={() => {
                          action.onClick();
                        }}
                      >
                        {action.label}
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  notification.onClose();
                }}
              >
                Закрыть
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
