import { Component, Suspense, type ReactNode } from "react";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { QueryFeedback } from "./query-feedback";

type BoundaryProps = {
  children: ReactNode;
  onReset: () => void;
  errorMessage?: string;
};
class ErrorBoundary extends Component<BoundaryProps, { error: Error | null }> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <QueryFeedback
          pending={false}
          error={this.state.error}
          errorMessage={this.props.errorMessage}
          onRetry={() => {
            this.props.onReset();
            this.setState({ error: null });
          }}
        />
      );
    return this.props.children;
  }
}

export function QueryPending() {
  return <QueryFeedback pending error={null} onRetry={() => {}} />;
}

export function QueryBoundary({
  children,
  errorMessage,
}: {
  children: ReactNode;
  errorMessage?: string;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} errorMessage={errorMessage}>
          <Suspense fallback={<QueryPending />}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
