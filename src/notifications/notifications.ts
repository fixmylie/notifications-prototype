/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification, NotificationProps } from "./notification";

type Topics = "change";
type Callback = (payload: any) => void;

type Handlers = Map<Topics, Set<Callback>>;

export type NotificationTypes = NotificationProps;

type Items = Array<Notification>;

interface Unsubscribe {
  (): void;
}

// class Notifications {
//   constructor(center, bus) {
//     this.actions = new Map();
//     this.items = [];
//     this.center = center;
//     this.bus = bus;

//     this.bus.subscribe(
//       { channel: "notifications", topic: "dispatch" },
//       (payload) => {
//         this.dispatch(payload.payload.action, payload.payload.payload, false);
//       }
//     );
//   }

//   public add(item) {
//     const notification = new Notification(item);

//     if (item.shared) {
//       this.bus.send({
//         channel: "notification-center",
//         topic: "add",
//         payload: item,
//       });
//     }

//     this.items = [...this.items, notification];

//     this.center.add(item);
//   }

//   public remove(id: string | number): void {
//     this.items = this.items.filter((item) => item.id !== id);

//     this.center.remove(item);
//   }

//   public on({ action }, cb) {
//     const set = this.actions.get(action) ?? new Set();
//     set.add(cb);

//     this.actions.set(action, set);

//     return (): void => {
//       set.delete(cb);
//     };
//   }

//   public dispatch(action, payload, shared) {
//     if (!this.actions.has(action)) return;
//     const actions = this.actions.get(action);

//     if (shared) {
//       this.bus.send({
//         channel: "notifications",
//         topic: "dispatch",
//         payload: { action, payload },
//       });
//     }

//     if (actions) {
//       actions.forEach((cb) => cb(payload));
//     }
//   }
// }

export class NotificationCenter {
  public notifications;
  public bus;
  private listeners;

  constructor({ bus }) {
    this.notifications = [];
    this.listeners = new Map();
    this.bus = bus;

    this.bus.subscribe(
      { channel: "notification-center", topic: "add" },
      (payload) => {
        this.add(payload.payload);
      }
    );
  }

  public createNamespace(namespace) {
    return {
      add: (item) => {
        this.add({
          ...item,
          id: `${namespace}.${item.id}`,
          namespace,
        });
      },
      remove: (id) => {
        this.remove(`${namespace}.${id}`);
      },
      on: (topic, cb) => {
        this.subscribe(
          { channel: "actions", topic: `${namespace}.${topic}` },
          cb
        );
      },
    };
  }

  public dispatch({ action, namespace }, payload) {
    this.send({ channel: "actions", topic: `${namespace}.${action}` }, payload);
  }

  private send(pattern, payload: any): void {
    const hasTopic =
      this.listeners.has(pattern.channel) &&
      this.listeners.get(pattern.channel).has(pattern.topic);

    if (!hasTopic) return;

    const topic = this.listeners.get(pattern.channel).get(pattern.topic);

    if (topic) {
      topic.forEach((cb) => cb(payload));
    }
  }

  public subscribe(pattern, cb: Callback): Unsubscribe {
    const hasChannel = this.listeners.has(pattern.channel);

    if (!hasChannel) {
      this.listeners.set(pattern.channel, new Map());
      const channel = this.listeners.get(pattern.channel);
      channel.set(pattern.topic, new Set());

      const topic = channel.get(pattern.topic);
      topic.add(cb);
    } else {
      const channel = this.listeners.get(pattern.channel);
      const hasTopic = channel.has(pattern.topic);

      if (!hasTopic) {
        channel.set(pattern.topic, new Set());
        const topic = channel.get(pattern.topic);
        topic.add(cb);
      } else {
        const topic = channel.get(pattern.topic);
        topic.add(cb);
      }
    }

    return (): void => {
      const channel = this.listeners.get(pattern.channel);
      const topic = channel.get(pattern.topic);

      topic.delete(cb);
    };
  }

  public add(item) {
    const notification = new Notification(item);

    this.notifications = [...this.notifications, notification];

    this.send(
      { channel: "center-notifications", topic: "change" },
      { notifications: this.notifications }
    );

    if (item.shared) {
      this.bus.send({
        channel: "notification-center",
        topic: "add",
        payload: item,
      });
    }
  }

  public remove(id: string | number): void {
    this.notifications = this.notifications.filter((item) => item.id !== id);

    this.send(
      { channel: "center-notifications", topic: "change" },
      { notifications: this.notifications }
    );
  }

  // public update() {
  //   this.send("change", { notifications: this.notifications });
  // }
}
