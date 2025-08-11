import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const UserDashboard = ({ user }) => {
  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      {/* Cover Image */}
      <div className="relative h-40 rounded-xl overflow-hidden bg-muted">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Cover Image
          </div>
        )}

        {/* Avatar - floating */}
        <div className="absolute -bottom-12 left-6">
          <Avatar className="w-24 h-24 border-4 border-background shadow-lg mb-20">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback>{user.fullName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* User Details Card */}
      <Card className="pt-14">
        <CardContent className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">{user.fullName}</h2>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>

          <div className="text-sm space-y-1">
            <p>Email: {user.email}</p>
            <p>Role: <Badge variant="outline">{user.role}</Badge></p>
          </div>

          <div className="text-xs text-muted-foreground">
            Member since: {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;
