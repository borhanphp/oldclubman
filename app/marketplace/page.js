"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBell, FaBoxes, FaHome, FaInbox, FaMapMarkerAlt, FaSearch, FaShoppingBag, FaTags } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";
import api from "@/helpers/axios";
import { useRouter } from "next/navigation";

const categories = [
  { key: "vehicles", label: "Vehicles", icon: <FaBoxes /> },
  { key: "property_rentals", label: "Property Rentals", icon: <FaHome /> },
  { key: "apparel", label: "Apparel", icon: <FaTags /> },
  { key: "electronics", label: "Electronics", icon: <FaShoppingBag /> },
];

const Sidebar = ({
  search,
  setSearch,
  onCreateListing,
  location,
  setLocation,
  selectedCategory,
  setSelectedCategory,
}) => {
  return (
    <aside className="w-[300px] shrink-0 border-r bg-white">
      <div className="p-3">
        <div className="text-2xl font-bold mb-2">Marketplace</div>

        {/* Search */}
        <div className="relative mb-3">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Marketplace"
            className="w-full pl-9 pr-3 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Primary nav */}
        <nav className="space-y-1">
          <Link href="/marketplace" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <FaShoppingBag className="text-blue-600" />
            <span>Browse all</span>
          </Link>
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <FaBell />
            <span>Notifications</span>
          </button>
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <FaInbox />
            <span>Inbox</span>
          </button>
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <FaTags />
            <span>Buying</span>
          </button>
          <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100">
            <FaBoxes />
            <span>Selling</span>
          </button>
        </nav>

        {/* Create listing */}
        <button
          onClick={onCreateListing}
          className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
        >
          <IoAddCircle className="text-xl" />
          <span>Create new listing</span>
        </button>

        {/* Location */}
        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">Location</div>
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <FaMapMarkerAlt />
            <input
              className="border rounded-md px-2 py-1 w-full"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City · Within 65 km"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-4">
          <div className="text-sm font-semibold mb-2">Categories</div>
          <div className="space-y-1">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key === selectedCategory ? "" : c.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                  selectedCategory === c.key ? "bg-gray-100 font-medium" : ""
                }`}
              >
                <span className="text-gray-700">{c.icon}</span>
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

const ListingCard = ({ item }) => {
  const price = item.price ? item.price : "FREE";
  return (
    <Link
      href={`/marketplace/listing/${item.id ?? ""}`}
      className="block rounded-lg overflow-hidden border hover:shadow-sm transition bg-white"
    >
      <div className="relative w-full h-48 bg-gray-100">
        <Image
          src={item.image || "/common-avator.jpg"}
          alt={item.title || "Listing"}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-3">
        <div className="font-semibold">{price}</div>
        <div className="text-sm text-gray-700 line-clamp-1">{item.title}</div>
        <div className="text-xs text-gray-500">{item.location || "Chittagong"}</div>
      </div>
    </Link>
  );
};

const ListingGrid = ({ items, loading }) => {
  return (
    <div className="flex-1">
      <h2 className="text-xl font-semibold mb-3">Today&apos;s picks</h2>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-72 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map((it) => (
            <ListingCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MarketplacePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("Chittagong · Within 65 km");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = useMemo(
    () => ({ q: search || undefined, location: location || undefined, category: selectedCategory || undefined }),
    [search, location, selectedCategory]
  );

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await api
        .get("/marketplace/listings", { params: query })
        .catch(() => ({ data: { data: [] } }));

      const data =
        res?.data?.data?.length
          ? res.data.data
          : [
              { id: 1, title: "infinix Hot 60i", price: "BDT7,000", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 2, title: "Gigabyte G5 RTX 4060 laptop", price: "BDT95,990", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 3, title: "Sedan (Used)", price: "BDT2,950,000", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 4, title: "Room for rent", price: "BDT5,700", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 5, title: "Honda VARIO 160 (2024)", price: "FREE", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 6, title: "Mitsubishi Car", price: "BDT1,580,000", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 7, title: "iPhone X 256GB", price: "BDT12,500", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 8, title: "Dell Inspiron 15 3511", price: "BDT20,250", location: "Chittagong", image: "/oldman-bg.jpg" },
              { id: 9, title: "Sport Bike", price: "FREE", location: "Chittagong", image: "/oldman-bg.jpg" },
            ];

      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchListings, 300);
    return () => clearTimeout(t);
  }, [query]);

  const onCreateListing = () => router.push("/marketplace/create");

  return (
    <div className="px-6 py-4">
      <div className="flex gap-4">
        <Sidebar
          search={search}
          setSearch={setSearch}
          onCreateListing={onCreateListing}
          location={location}
          setLocation={setLocation}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <main className="flex-1">
          <ListingGrid items={items} loading={loading} />
        </main>
      </div>
    </div>
  );
}


