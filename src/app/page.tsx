"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [data, setData] = useState<any>();

  useEffect(() => {
    fetch("/api/test")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  console.log(data);
  return (
    <main>
      <div>Testing</div>
    </main>
  );
}
