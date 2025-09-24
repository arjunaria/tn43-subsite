

import Image from "next/image";
import { pool } from "@/utils/db";
import type { RowDataPacket } from "mysql2";
import { cookies } from "next/headers";



type Property = {
  property_id: number;
  title: string;
  address: string;
  rating: number;
  description?: string;
  image_url?: string | null;
  latitude?: number;
  longitude?: number;
};

type Amenity = {
  ref_id: number;
  ref_name: string;
  ref_icon: string;
  ref_icon_na: string;
  ref_parent: number;
  available: boolean;
  parent_name: string; // we'll join the parent name
};

export default async function PropertyPage() {
    const cookieStore = await cookies();
   const subdomain = cookieStore.get("subdomain")?.value || "www";

  // Fetch property info
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM properties WHERE domain = ?`,
    [subdomain]
  );
  const property = rows[0] as Property;
  console.log(property);
  return(
    <>{subdomain}</>
  )
}