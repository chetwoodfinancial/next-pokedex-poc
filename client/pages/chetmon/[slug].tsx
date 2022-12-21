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
    abilities: string[];
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
    <article>
      <h1>{name}</h1>
      {mainImage && (
        <div>
          <img
            src={urlFor(mainImage).width(200).url()}
            alt={`${name}'s picture`}
          />
        </div>
      )}
      <span>By {creator}</span>
      {categories && (
        <ul>
          Posted in
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {abilities && (
        <ul>
          Abilities:
          {abilities.map((ability) => (
            <li key={ability}>{ability}</li>
          ))}
        </ul>
      )}

      <PortableText value={description} components={ptComponents} />
    </article>
  );
};

const query = groq`*[_type == "chetmon" && slug.current == $slug][0]{
  name,
  "creator": creator->name,
  "categories": categories[]->title,
  "abilities": abilities[]->title,
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
