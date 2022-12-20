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
  post: {
    title: string;
    name: string;
    categories: string[];
    authorImage: any;
    body: any;
  };
};

const Post = ({ post }: Props) => {
  const {
    title = "Missing title",
    name = "Missing name",
    categories,
    authorImage,
    body = [],
  } = post || {};
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {categories && (
        <ul>
          Posted in
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {authorImage && (
        <div>
          <img
            src={urlFor(authorImage).width(200).url()}
            alt={`${name}'s picture`}
          />
        </div>
      )}
      <PortableText value={body} components={ptComponents} />
    </article>
  );
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  body
}`;

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  // It's important to default the slug so that it doesn't return "undefined"
  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  return {
    props: {
      post,
    },
    revalidate: 10,
  };
}
export default Post;
