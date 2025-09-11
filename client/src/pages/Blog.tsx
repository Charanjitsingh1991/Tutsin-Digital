import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { BlogPost } from "@shared/schema";

export default function Blog() {
  const [match, params] = useRoute("/blog/:id");
  const isDetailView = match && params?.id;

  const { data: posts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog/posts"],
  });

  const { data: post, isLoading: isLoadingPost } = useQuery<BlogPost>({
    queryKey: ["/api/blog/posts", params?.id],
    enabled: !!isDetailView,
  });

  if (isDetailView) {
    if (isLoadingPost) {
      return (
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Loading post...</div>
        </div>
      );
    }

    if (!post) {
      return (
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground">The requested blog post could not be found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-16">
        <article className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="text-sm text-primary font-semibold mb-4" data-testid="text-post-category">{post.category}</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground" data-testid="text-post-title">{post.title}</h1>
              <p className="text-xl text-muted-foreground mb-8" data-testid="text-post-excerpt">{post.excerpt}</p>
              <div className="text-sm text-muted-foreground" data-testid="text-post-date">
                Published on {new Date(post.createdAt!).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            {post.imageUrl && (
              <div className="mb-12">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-96 object-cover rounded-2xl shadow-2xl" 
                  data-testid="img-post-featured"
                />
              </div>
            )}
            
            <div className="prose prose-lg max-w-none" data-testid="content-post-body">
              <p className="text-foreground leading-relaxed text-lg">
                {post.content}
              </p>
            </div>
          </div>
        </article>
      </div>
    );
  }

  if (isLoadingPosts) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="pt-16">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6" data-testid="text-blog-page-title">
              <span className="text-gradient">Our Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto" data-testid="text-blog-page-description">
              Stay updated with the latest trends in digital marketing, web design, and technology. Insights from industry experts to help grow your business.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts && posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <article key={post.id} className="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300" data-testid={`card-blog-post-${index}`}>
                  <img 
                    src={post.imageUrl || `https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250`} 
                    alt={post.title} 
                    className="w-full h-48 object-cover" 
                    data-testid={`img-blog-post-${index}`}
                  />
                  <div className="p-6">
                    <div className="text-sm text-primary font-semibold mb-2" data-testid={`category-blog-post-${index}`}>{post.category}</div>
                    <h2 className="text-xl font-bold mb-3 text-foreground" data-testid={`title-blog-post-${index}`}>{post.title}</h2>
                    <p className="text-muted-foreground mb-4" data-testid={`excerpt-blog-post-${index}`}>{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground" data-testid={`date-blog-post-${index}`}>
                        {new Date(post.createdAt!).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <a href={`/blog/${post.id}`} className="text-primary hover:underline" data-testid={`link-read-more-${index}`}>
                        Read More
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold mb-4 text-foreground">No Blog Posts Available</h2>
              <p className="text-muted-foreground">Check back soon for new content and insights.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
