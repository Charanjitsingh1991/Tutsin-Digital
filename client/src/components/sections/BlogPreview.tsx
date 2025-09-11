import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BlogPost } from "@shared/schema";

export function BlogPreview() {
  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  if (isLoading) {
    return (
      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">Loading blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  const displayPosts = posts?.slice(0, 3) || [];

  return (
    <section id="blog" className="py-20 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-blog-title">
            <span className="text-gradient">Latest Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-blog-description">
            Stay updated with the latest trends in digital marketing, web design, and technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {displayPosts.map((post, index) => (
            <article key={post.id} className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300" data-testid={`card-blog-${index}`}>
              <img 
                src={post.imageUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`} 
                alt={post.title} 
                className="w-full h-48 object-cover" 
                data-testid={`img-blog-${index}`}
              />
              <div className="p-6">
                <div className="text-sm text-primary font-semibold mb-2" data-testid={`category-blog-${index}`}>{post.category}</div>
                <h3 className="text-xl font-bold mb-3 text-foreground" data-testid={`title-blog-${index}`}>{post.title}</h3>
                <p className="text-muted-foreground mb-4" data-testid={`excerpt-blog-${index}`}>{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground" data-testid={`date-blog-${index}`}>
                    {new Date(post.createdAt!).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                  <Link href={`/blog/${post.id}`} data-testid={`link-read-more-${index}`}>
                    <span className="text-primary hover:underline cursor-pointer">Read More</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/blog" data-testid="link-view-all-posts">
            <Button className="gradient-bg text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
