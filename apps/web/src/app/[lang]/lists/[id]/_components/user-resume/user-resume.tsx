import { ProBadge } from '@/components/pro-badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useLanguage } from '@/context/language'
import { supabase } from '@/services/supabase'
import { Profile } from '@/types/supabase'
import { tmdbImage } from '@/utils/tmdb/image'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

type UserResumeProps = {
  userId: string
}

export const UserResume = ({ userId }: UserResumeProps) => {
  const { language, dictionary } = useLanguage()

  const { data: profile, isLoading } = useQuery({
    queryKey: [userId],
    queryFn: async () =>
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single<Profile>(),
    select: (response) => response.data,
  })

  if (isLoading || !profile) {
    return <UserResumeSkeleton />
  }

  const username = profile.username
  const profileHref = `/${language}/${username}`

  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border p-6">
      <div className="flex justify-between">
        <Link href={profileHref} className="">
          <Avatar className="h-16 w-16">
            {profile.image_path && (
              <AvatarImage
                src={tmdbImage(profile.image_path, 'w500')}
                className="object-cover"
              />
            )}

            <AvatarFallback className="uppercase">
              {username && username[0]}
            </AvatarFallback>
          </Avatar>
        </Link>

        <Button className="" size="sm" disabled>
          {dictionary.follow}
        </Button>
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Link className="text-lg font-semibold" href={profileHref}>
            {username}
          </Link>

          <ProBadge />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            0 {dictionary.followers}
          </span>
          <Separator className="h-4" orientation="vertical" />
          <span className="text-xs text-muted-foreground">
            0 {dictionary.following}
          </span>
        </div>
      </div>
    </div>
  )
}

export const UserResumeSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-lg border p-6">
      <div className="flex justify-between">
        <Skeleton className="h-16 w-16 rounded-full" />

        <Button className="" size="sm" disabled>
          Follow
        </Button>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-[3ex] w-[15ch]" />

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Skeleton className="h-[2ex] w-[2ch]" /> Followers
          </span>

          <Separator className="h-4" orientation="vertical" />

          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Skeleton className="h-[2ex] w-[2ch]" /> Following
          </span>
        </div>
      </div>
    </div>
  )
}
