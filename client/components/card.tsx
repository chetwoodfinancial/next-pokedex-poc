import Link from "next/link";
import imageUrlBuilder from "@sanity/image-url";

import client from "../client";

const urlFor = (source) => imageUrlBuilder(client).image(source);

const Card = ({ chetmon }) => {
  const { _id, name, slug, abilities, creator, mainImage } = chetmon || {};
  return (
    <li
      className="block max-w-sm w-60 h-90 text-white px-2 pt-2 pb-4 m-5 rounded-lg shadow-md hover:bg-gray-500 dark:bg-slate-800 dark:border-gray-700 dark:hover:bg-gray-700"
      key={_id}
    >
      <Link
        href="/chetmon/[slug]"
        as={`/chetmon/${slug.current}`}
        className="h-full flex flex-col justify-between"
      >
        {mainImage && (
          <div>
            <img
              src={urlFor(mainImage).width(300).url()}
              alt={`${name}'s picture`}
              className="rounded-lg"
            />
          </div>
        )}
        <div className="mt-6">
          <span className="text-gray-400 text-xs">By {creator}</span>
          <h2 className="font-bold">{name}</h2>
          <hr className="my-2 h-px bg-gray-500 border-0 dark:bg-gray-700" />
          {abilities.length !== 0 && (
            <>
              <h3 className="text-gray-400 text-sm">Abilities:</h3>
              <ul>
                {abilities.map((ability) => (
                  <li key={ability} className="text-xs">
                    {ability}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </Link>{" "}
    </li>
  );
};

export default Card;
