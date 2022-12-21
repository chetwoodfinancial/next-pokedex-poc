import Link from "next/link";
import groq from "groq";
import client from "../client";

type Props = {
  chetmons: Array<{
    _id: string;
    name: string;
    slug: {
      current: string;
    };
    publishedAt: string;
  }>;
};

const Index = ({ chetmons }: Props) => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Welcome to a blog!</h1>
      {chetmons.length > 0 &&
        chetmons.map(
          ({ _id, name = "", slug = { current: "" }, publishedAt = "" }) =>
            slug && (
              <li key={_id}>
                <Link href="/chetmon/[slug]" as={`/chetmon/${slug.current}`}>
                  {name}
                </Link>{" "}
                ({new Date(publishedAt).toDateString()})
              </li>
            )
        )}
    </div>
  );
};

export async function getStaticProps() {
  const chetmons = await client.fetch(groq`
      *[_type == "chetmon" && publishedAt < now()] | order(publishedAt desc)
    `);
  return {
    props: {
      chetmons,
    },
    revalidate: 10,
  };
}

export default Index;
