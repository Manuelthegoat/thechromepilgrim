import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Eyebrow from "../components/shared/Eyebrow";
import { supabase } from "../lib/supabaseClient";
import "./Gallery.css";

function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data, error } = await supabase
        .from("gallery_items")
        .select("id, title, images")
        .eq("active", true)
        .order("created_at", { ascending: false });

      if (!error) setItems(data);
      setLoading(false);
    }
    fetchGallery();
  }, []);

  return (
    <section className="gallery">
      <Eyebrow>THE GALLERY</Eyebrow>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="gallery__grid">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/gallery/${item.id}`}
              className="gallery__item"
            >
              <div className="gallery__image-wrap">
                {item.images?.[0] && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="gallery__image"
                  />
                )}
              </div>
              <div className="gallery__title">{item.title}</div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default Gallery;
