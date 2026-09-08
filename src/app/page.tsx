import { getAllPosts } from "@/lib/posts";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import PoemsList from "@/components/home/PoemsList";
import Books from "@/components/home/Books";
import QuoteBlock from "@/components/home/QuoteBlock";
import Events from "@/components/home/Events";
import Subscribe from "@/components/home/Subscribe";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <Hero />
      <About />
      <PoemsList posts={posts} />
      <Books />
      <QuoteBlock />
      <Events />
      <Subscribe />
    </>
  );
}
