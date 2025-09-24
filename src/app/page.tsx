

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

  // Fetch property images
  const [photos] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC`,
    [property.property_id]
  );
  const bannerImage = photos[0]?.image_url || "/dummy.jpeg";

  // Fetch amenities and join with parent category
const [amenityRows] = await pool.execute<RowDataPacket[]>(
  `SELECT rm.ref_id, rm.ref_name, rm.ref_icon, rm.ref_icon_na, rm.ref_parent
   FROM property_amenities pa
   JOIN ref_data rm ON pa.ref_id = rm.ref_id
   WHERE pa.property_id = ?
     AND rm.ref_type = 1
   ORDER BY rm.ref_parent, rm.ref_id`,
  [property.property_id]
);

  const amenities = (Array.isArray(amenityRows) ? amenityRows : []) as Amenity[];

  // Group amenities by parent category name
  
const [attractions] = await pool.execute<RowDataPacket[]>(
    `SELECT * FROM attractions`
    
  );

  return (
    <div>
      {/* Hero Banner */}
      <div className="relative w-full h-[400px]">
        <Image
          src={bannerImage.startsWith("/") ? bannerImage : `/${bannerImage}`}
          alt={property?.title || "Property image"}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white text-center">
            {property?.title}
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Property Description) */}
        <div className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-xl  mb-4">About this place</h3>
            <p className="text-gray-700 leading-relaxed">
              {property?.description || "No description available."}
            </p>
Where you’ll be
Bangalore Urban, Karnataka, India
<div className="relative w-full h-[300px] bg-gray-100 rounded-md mt-1 mb-1">
map

</div>

<div className="grid gap-4">
  {attractions.map((attraction, index) => (
    <div
      key={attraction.attraction_id}
      className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 p-2 rounded-md"
    >
      {/* Image Column */}
      <div
        className={`p-8 relative w-full aspect-square ${
          index % 2 !== 0 ? "sm:order-last" : ""
        }`}
      >
        <Image
          src="/finch.jpeg"
          alt={attraction.attraction_name || "Attraction image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover rounded-md"
        />
      </div>

      {/* Content Column */}
      <div className="flex flex-col justify-center p-8">
        <h4 className="font-semibold text-lg">{attraction.attraction_name}</h4>
        <p className="text-gray-600 text-sm">{attraction.attraction_desc}</p>
      </div>
    </div>
  ))}
</div>






          </div>
        </div>

        {/* Right Column (Details + Amenities) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Property Details */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h4 className="text-lg font-semibold mb-2">Details</h4>
            <p className="text-gray-600">{property?.address}</p>
            <p className="text-yellow-500 font-medium mt-2">
              ⭐ {property?.rating || "N/A"}
            </p>
          </div>

          {/* Amenities */}
          <div className="border rounded-lg p-4 shadow-sm bg-white">
            <h4 className="text-lg font-semibold mb-4">Amenities</h4>

                  {amenities.map((amenity) => (
                    <div
                      key={amenity.ref_id}
                      className="flex items-center space-x-2 text-gray-700"
                    >
                      <i
                        className={`${amenity.ref_icon} text-xl`}
                      ></i>
                      <span
                        className={amenity.available ? "" : "line-through opacity-50"}
                      >
                        {amenity.ref_name}
                      </span>
                    </div>
                  ))}

          </div>
        </div>
      </div>
    </div>
  );
}
