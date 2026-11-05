import { Hono } from "hono";
import {EmailController} from "../controller/email.controller.js";

export const emailRoute = new Hono();

emailRoute.post("/publish",EmailController.publish);