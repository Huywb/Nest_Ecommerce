import LoginForm from "@/app/components/modules/auth/LoginForm"


export const revalidate = false
const page = () => {
  return (
    <>
        <LoginForm />
    </>
  )
}

export default page

export function generateMetadata() {
  return {
    title: `Page - Title here`,
    description: "Page - Description here",
    icons: {
      icon: 'path to asset file'
    }
  }
}
