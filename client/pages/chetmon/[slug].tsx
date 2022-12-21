import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";

import client from "../../client";

// type definition for urlFor function
// type UrlFor = (source: any) => string;

const urlFor = (source) => imageUrlBuilder(client).image(source);

const ptComponents = {
  types: {
    image: ({ value }) => <img src={value.imageUrl} />,

    // image: ({ value }) => {
    //   if (!value?.asset?._ref) {
    //     return null;
    //   }
    //   return (
    //     <Image
    //       alt={value.alt || " "}
    //       loading="lazy"
    //       // src={urlFor(value).width(320).height(240).fit("max").auto("format")}
    //       src={imageUrlBuilder(client)
    //         .image(value)
    //         .width(320)
    //         .height(240)
    //         .fit("max")
    //         .auto("format")}
    //     />
    //   );
    // },
  },
};

type Props = {
  chetmon: {
    name: string;
    creator: string;
    categories: string[];
    abilities: object[];
    authorImage: any;
    mainImage: any;
    description: any;
  };
};

const Chetmon = ({ chetmon }: Props) => {
  const {
    name,
    creator,
    categories,
    abilities,
    authorImage,
    mainImage,
    description,
  } = chetmon || {};
  console.log({ chetmon });

  return (
    <article className="text-white">
      <div className="w-full flex flex-row justify-center">
        <div className="max-w-lg flex flex-col items-center w-100 h-90 text-white px-2 pt-2 pb-4 bg-gray-700 mt-10 m-5 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <h1 className="text-5xl font-bold my-5">{name}</h1>
          {mainImage && (
            <div className="mb-2">
              <img
                src={urlFor(mainImage).width(300).url()}
                alt={`${name}'s picture`}
              />
            </div>
          )}
          <span className="text-xs">By {creator}</span>
          <div className="flex flex-row items-center">
            <div className="mr-5">
              {abilities && (
                <ul className="mt-5">
                  <h2 className="text-bold">Abilities:</h2>
                  {abilities.map((ability) => (
                    <li key={ability.title}>
                      <h3>{ability.title}</h3>
                      <p>{ability.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="ml-5">
              <h2 className="text-bold">Description:</h2>
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
