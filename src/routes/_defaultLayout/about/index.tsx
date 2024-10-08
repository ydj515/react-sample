import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_defaultLayout/about/')({
  component: () => <div>Hello /_defaultLayout/aboutus/!</div>,
})
