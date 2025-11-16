import { Edit, Grid, Heart, MessageCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { CustomAvatar } from "../components/CustomAvatar";
import { Sidebar } from "../components/Sidebar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useUserPosts, useUserProfile } from "../hooks/api/useUser";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: authUser } = useAuth();

  const { data: profileUser, isLoading: profileLoading } = useUserProfile(username || '');
  const isOwnProfile = authUser?.username === username;

  const { data: posts = [], isLoading: postsLoading } = useUserPosts(profileUser?.id || 0);

  if (profileLoading) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center text-muted-foreground py-8">
                Loading profile...
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <AppHeader />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-background">
            <div className="max-w-4xl mx-auto p-6">
              <div className="text-center text-muted-foreground py-8">
                User not found
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }
  const avatarUrl = profileUser.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser.username}`;

  return (
    <div className="h-screen flex flex-col bg-background">
      <AppHeader />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Profile Header */}
            <Card className="bg-card border-border p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <CustomAvatar avatarUrl={avatarUrl} name={profileUser.name} size="xxl"/>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl mb-2">{profileUser.name}</h1>
                  <p className="text-muted-foreground mb-4">@{profileUser.username}</p>
                  <p className="text-muted-foreground mb-6">
                    Member since {new Date(profileUser.created_at).toLocaleDateString()}
                  </p>
                  
                  {/* won't be implemented */}
                  {/* <div className="flex gap-6 justify-center md:justify-start mb-6">
                    <div>
                      <div className="text-2xl">156</div>
                      <div className="text-sm text-muted-foreground">Постів</div>
                    </div>
                    <div>
                      <div className="text-2xl">842</div>
                      <div className="text-sm text-muted-foreground">Підписників</div>
                    </div>
                    <div>
                      <div className="text-2xl">291</div>
                      <div className="text-sm text-muted-foreground">Підписки</div>
                    </div>
                  </div> */}

                  <div className="flex gap-3 justify-center md:justify-start">
                    {isOwnProfile ? (
                      <Button
                        variant="outline"
                        className="border-border hover:bg-secondary"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button className="bg-primary hover:bg-primary/90">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Написати
                        </Button>
                        <Button variant="outline" className="border-border hover:bg-secondary">
                          <Grid className="w-4 h-4 mr-2" />
                          Пости
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Posts Section */}
            <div>
              <h2 className="text-2xl mb-4">Останні пости</h2>
              {postsLoading ? (
                <div className="text-center text-muted-foreground py-8">
                  Loading posts...
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No posts yet
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {posts.map((post) => {
                    const timeAgo = new Date(post.created_at);
                    const now = new Date();
                    const diffInHours = Math.floor((now.getTime() - timeAgo.getTime()) / (1000 * 60 * 60));

                    let timeText = '';
                    if (diffInHours < 1) {
                      timeText = 'Just now';
                    } else if (diffInHours < 24) {
                      timeText = `${diffInHours} hours ago`;
                    } else {
                      const diffInDays = Math.floor(diffInHours / 24);
                      timeText = `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
                    }

                    return (
                      <Card
                        key={post.id}
                        className="bg-card border-border p-6 hover:bg-[#1F1F1F] transition-colors cursor-pointer"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <CustomAvatar avatarUrl={avatarUrl} name={profileUser.name} />
                          <div className="flex-1">
                            <h3>{profileUser.name}</h3>
                            <p className="text-sm text-muted-foreground">{timeText}</p>
                          </div>
                        </div>

                        <p className="mb-4">{post.body}</p>

                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Heart className="w-5 h-5" />
                          <span>0</span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
