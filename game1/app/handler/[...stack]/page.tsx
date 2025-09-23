import { StackHandler } from "@stackframe/stack"
import { stackServerApp } from "@/lib/stack-auth"

export default function Handler(props: any) {
  return <StackHandler fullPage app={stackServerApp} routeProps={props} />
}
