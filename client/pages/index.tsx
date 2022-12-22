import groq from "groq";

import client from "../client";
import Card from "../components/card";

type Props = {
  chetmons: Array<{
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    publishedAt: string;
    creator: string;
    categories: string[];
    abilities: string[];
    authorImage: any;
    mainImage: any;
    description: any;
  }>;
};

const Index = ({ chetmons }: Props) => {
  return (
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-5xl text-white font-bold mb-4">
        Welcome to the Chetmons!
      </h1>
      <ul className="flex flex-row flex-wrap max-w-4xl">
        {chetmons.length > 0 &&
          chetmons.map(
            (chetmon) =>
              chetmon.slug && <Card chetmon={chetmon} key={chetmon._id} />
          )}
      </ul>
    </div>
  );
};

export async function getStaticProps() {
  const chetmons = await client.fetch(groq`
      *[_type == "chetmon" && publishedAt < now()]{
        _id,
        name,
        slug,
        "creator": creator->name,
        "categories": categories[]->title,
        "abilities": abilities[]->title,
        "authorImage": author->image,
        "mainImage": mainImage,
        description
      } | order(publishedAt desc)
    `);
  return {
    props: {
      chetmons,
    },
    revalidate: 10,
  };
}

export default Index;
