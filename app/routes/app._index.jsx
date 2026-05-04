import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export async function loader({ request }) {
  await authenticate.admin(request);

  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  const [
    totalConversations,
    conversationsLast7Days,
    conversationsLast30Days,
    totalUserMessages,
    totalBarbMessages,
    recentConversations,
  ] = await Promise.all([
    prisma.conversation.count(),
    prisma.conversation.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.conversation.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.message.count({ where: { role: "user" } }),
    prisma.message.count({ where: { role: "assistant" } }),
    prisma.conversation.findMany({
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 1,
        },
      },
    }),
  ]);

  return {
    totalConversations,
    conversationsLast7Days,
    conversationsLast30Days,
    totalUserMessages,
    totalBarbMessages,
    recentConversations: recentConversations.map((c) => ({
      id: c.id,
      updatedAt: c.updatedAt.toISOString(),
      firstMessage: c.messages[0]
        ? JSON.parse(c.messages[0].content)?.[0]?.text?.slice(0, 80) ?? null
        : null,
    })),
  };
}

export default function Index() {
  const {
    totalConversations,
    conversationsLast7Days,
    conversationsLast30Days,
    totalUserMessages,
    totalBarbMessages,
    recentConversations,
  } = useLoaderData();

  return (
    <s-page>
      <ui-title-bar title="Barb Dashboard" />

      <s-section heading="Overview">
        <s-stack gap="base">
          <s-columns>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Total conversations</s-text>
                <s-heading>{totalConversations}</s-heading>
              </s-stack>
            </s-box>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Last 7 days</s-text>
                <s-heading>{conversationsLast7Days}</s-heading>
              </s-stack>
            </s-box>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Last 30 days</s-text>
                <s-heading>{conversationsLast30Days}</s-heading>
              </s-stack>
            </s-box>
          </s-columns>
          <s-columns>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Customer messages</s-text>
                <s-heading>{totalUserMessages}</s-heading>
              </s-stack>
            </s-box>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Barb responses</s-text>
                <s-heading>{totalBarbMessages}</s-heading>
              </s-stack>
            </s-box>
            <s-box border="base" padding="base" border-radius="base">
              <s-stack gap="tight">
                <s-text tone="subdued">Avg messages / convo</s-text>
                <s-heading>
                  {totalConversations > 0
                    ? Math.round(
                        (totalUserMessages + totalBarbMessages) /
                          totalConversations
                      )
                    : 0}
                </s-heading>
              </s-stack>
            </s-box>
          </s-columns>
        </s-stack>
      </s-section>

      <s-section heading="Recent conversations">
        {recentConversations.length === 0 ? (
          <s-text tone="subdued">No conversations yet.</s-text>
        ) : (
          <s-stack gap="tight">
            {recentConversations.map((c) => (
              <s-box key={c.id} border="base" padding="base" border-radius="base">
                <s-stack gap="extraTight">
                  <s-text tone="subdued" size="small">
                    {new Date(c.updatedAt).toLocaleString("en-AU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </s-text>
                  {c.firstMessage && (
                    <s-text>"{c.firstMessage}{c.firstMessage.length >= 80 ? "..." : ""}</s-text>
                  )}
                </s-stack>
              </s-box>
            ))}
          </s-stack>
        )}
      </s-section>
    </s-page>
  );
}
