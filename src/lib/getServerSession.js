import { getServerSession as _getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default function getServerSession() {
  return _getServerSession(authOptions);
}
