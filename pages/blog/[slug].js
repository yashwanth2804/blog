// pages/blog/[slug].js
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import ReactMarkdown from 'react-markdown';
import { Children } from 'react';

export default function BlogPost({ frontMatter, markdownBody }) {
  return (
    <div>
      <h1>{frontMatter.title}</h1>
      <p>Date: {frontMatter.date}</p>
      <ReactMarkdown  >{markdownBody}</ReactMarkdown>
    </div>
  );
}

export async function getStaticPaths() {
  const files = fs.readdirSync('_posts');
  const paths = files.map((filename) => ({
    params: {
      slug: path.parse(filename).name,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const filePath = path.join('_posts', `${params.slug}.md`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
   // Convert the Date object to a string
   const dateString = data.date.toISOString();

  return {
    props: {
      frontMatter: {
        ...data,
        date: dateString, // Convert date to string
      },
      markdownBody: content,
    },
  };
}
