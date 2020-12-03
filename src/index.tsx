import React from "react";
import ReactDOM from "react-dom";

import { NotificationCenter } from "./notifications";
import { BrowserMessageBus } from "./message-bus";

import { Snackbar } from "./Snackbar";

const bus = BrowserMessageBus.create();
const notificatoinCenter = new NotificationCenter({ bus });

const notificationsOne = notificatoinCenter.createNamespace("@vega-one");
const notificationsTwo = notificatoinCenter.createNamespace("@vega-two");

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const AppFirst = () => {
  const [color, setColor] = React.useState("red");
  const [notifications, setNotifications] = React.useState([]);

  React.useEffect(() => {
    notificationsOne.on("change-color", (payload) => {
      setColor(payload.color);
    });

    notificationsOne.on("reload", (payload) => {
      location.reload();
    });

    notificationsTwo.on("change-color", (payload) => {
      setColor("red");
    });

    notificationsTwo.on("more", (payload, item) => {
      setColor("red");
    });
  }, []);

  return (
    <div style={{ marginBottom: "60px" }}>
      <div style={{ width: "50px", backgroundColor: color, height: "50px" }} />

      <button
        style={{ marginBottom: "10px" }}
        onClick={() => {
          const id = Math.random();
          const color = getRandomColor();

          notificationsOne.add({
            id,
            body: `Цвет поменяется на ${color}`,
            shared: true,
            actions: [
              {
                title: `Поменять цвет`,
                action: "change-color",
                payload: { color },
              },
            ],
          });
        }}
      >
        Добавить уведомление из vega-one
      </button>
      <button
        style={{ marginBottom: "10px" }}
        onClick={() => {
          const id = Math.random();
          const color = getRandomColor();

          notificationsTwo.add({
            id,
            body: `Цвет поменяется на ${color}`,
            shared: true,
            actions: [
              {
                title: `Поменять цвет`,
                action: "change-color",
                payload: { color },
              },
            ],
          });
        }}
      >
        Добавить уведомление из vega-two
      </button>
      <button
        style={{ marginBottom: "10px" }}
        onClick={() => {
          const id = Math.random();
          const color = getRandomColor();

          notificationsTwo.add({
            id,
            body: `Добавить уведомление из vega-two Добавить уведомление из vega-two Добавить уведомление из vega-twoДобавить уведомление из vega-two Добавить уведомление из vega-two`,
            shared: true,
            actions: [
              {
                title: `Показать больше`,
                action: "more",
                payload: { color },
              },
            ],
          });
        }}
      >
        Добавить длинное уведомление
      </button>
      <Snackbar notifications={notificatoinCenter} />
    </div>
  );
};

ReactDOM.render(
  <>
    <AppFirst />
    {/* <AppSecond /> */}
  </>,
  document.getElementById("root")
);
