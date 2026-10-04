import { MobileBottomNavigation } from "@/components/shared/mobile-bottom-navigation"
import { requireAuthorizedSession } from "@/lib/auth/session"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  await requireAuthorizedSession()

  return (
    <>
      <div className="[&>main]:pb-[calc(6rem+env(safe-area-inset-bottom))] sm:[&>main]:pb-8">
        {children}
      </div>
      <MobileBottomNavigation />
    </>
  )
}
