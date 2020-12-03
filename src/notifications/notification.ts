/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-classes-per-file */
import React from "react";

type Action = {
  title: string;
  action: string;
  payload?: any;
};

export type NotificationProps = {
  id: string;
  body: string;
  actions?: Action[];
  icon?: string;
};

export class Notification {
  public readonly id: string;

  public body: string;

  private shared: boolean;

  public readonly closable: boolean;

  public onClose?(): void;

  public actions?: Action[];

  public readonly namespace;

  public data: any;

  constructor(props: NotificationProps) {
    const {
      id,
      body,
      actions = [],
      data,
      shared = false,
      namespace,
      closable = true,
    } = props;

    this.id = id;
    this.body = body;
    this.actions = actions;
    this.data = data;
    this.shared = shared;
    this.namespace = namespace;
    this.closable = closable;
  }
}
