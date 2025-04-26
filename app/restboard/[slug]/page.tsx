"use client"
import { useParams } from "next/navigation";

export default function restBoard() {
  let slug = useParams().slug;

  return (
    <div>
      <h1>This is a restaurant dashboard for {slug}</h1>
    </div>
  );
}
