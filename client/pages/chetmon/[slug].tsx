import groq from "groq";
import { PortableText } from "@portabletext/react";

import client from "../../client";
import { urlFor } from "../../utils";

const ptComponents = {
  types: {
    image: ({ value }) => <img src={value.imageUrl} />,
  },
};

// Define an interface for the object type
interface Ability {
  title: string;
  description: string;
}

type Props = {
  chetmon: {
    name: string;
    creator: string;
    categories: string[];
    abilities: Array<Ability>;
    authorImage: any;
    mainImage: any;
    description: any;
  };
};

const Chetmon = ({ chetmon }: Props) => {
  const { name, creator, abilities, mainImage, description } = chetmon || {};

  return (
    <article className="text-white">
      <div className="w-full flex flex-row justify-center">
        <div className="max-w-lg flex flex-col items-center w-100 h-90 text-white px-2 pt-2 pb-4 bg-gray-700 mt-10 m-5 rounded-lg shadow-2xl dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-5xl font-bold my-5">{name}</h1>
          {mainImage && (
            <div className="my-5">
              <img
                src={urlFor(mainImage).width(300).url()}
                alt={`${name}'s picture`}
              />
            </div>
          )}
          <span className="text-gray-400 text-xs">By {creator}</span>
          <div className="flex flex-row items-center divide-x divide-gray-400 mt-8">
            <div className="mr-5 px-4">
              {abilities && (
                <ul className="flex flex-col justify-between">
                  <h2 className="text-bold mb-2 text-xl">Abilities</h2>
                  {abilities.map((ability) => (
                    <li className="mb-4" key={ability.title}>
                      <h3>{ability.title}</h3>
                      <p className="text-xs italic text-gray-400">
                        {ability.description}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="ml-5 px-4 flex flex-col justify-between">
              <h2 className="text-bold mb-2 text-xl">Description</h2>
              <PortableText value={description} components={ptComponents} />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

const query = groq`*[_type == "chetmon" && slug.current == $slug][0]{
  name,
  "creator": creator->name,
  "categories": categories[]->title,
  "abilities": abilities[]->{title, description},
  "authorImage": author->image,
  "mainImage": mainImage,
  description
}`;

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "chetmon" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const chetmon = await client.fetch(query, { slug });
  return {
    props: {
      chetmon,
    },
    revalidate: 10,
  };
}
export default Chetmon;
