# Unified Post Form Component

The `PostFrom` component is a unified form component that can be used for both creating and updating posts. It supports all post types: post, event, and destination.

## Usage

### For Create Mode

```tsx
import PostFrom from "./post-form";

export default function CreatePostPage() {
  const searchParams = useSearchParams();
  const type = (searchParams.get("type") || "post") as
    | "post"
    | "event"
    | "destination";

  return <PostFrom mode="create" type={type} />;
}
```

### For Update Mode

```tsx
import PostFrom from "./post-form";
import { PostInterface } from "@/interfaces/post.interface";

interface Props {
  oldPost: PostInterface;
}

export default function UpdatePostPage({ oldPost }: Props) {
  // Transform the old post data to match the form schema
  const initialValues = {
    type: oldPost.type,
    title: { ...oldPost.title },
    content: { ...oldPost.content },
    show_comments: oldPost.showComments,
    categories:
      oldPost.categories?.map((cat) => ({ id: cat.id, name: cat.name })) || [],
    gallery_images: [],
    gallery_images_url: oldPost.media || [],
    ...(oldPost.type !== "event"
      ? {
          readability: oldPost.readabilityEnabled || false,
        }
      : {
          startDate: "",
          endDate: "",
        }),
  };

  return (
    <PostFrom
      mode="update"
      type={oldPost.type}
      postId={oldPost.id}
      initialValues={initialValues}
    />
  );
}
```

## Props

- `mode`: "create" | "update" - Determines the form behavior
- `type`: "post" | "event" | "destination" - The type of post
- `postId?`: string - Required for update mode
- `initialValues?`: FormData - Initial values for update mode
- `isLoading?`: boolean - External loading state
- `onFinish?`: Function - Custom submit handler

## Features

- **Multi-language support**: Supports English, Arabic, and French
- **Form validation**: Uses Zod schemas for validation
- **File upload**: Handles gallery images upload
- **Type-specific fields**: Different fields based on post type
- **Error handling**: Comprehensive error display and handling
- **Loading states**: Built-in loading states for mutations

## Validation

The component uses different validation schemas for create and update modes:

- **Create mode**: Requires at least one gallery image
- **Update mode**: Gallery images are optional (can use existing images)

## API Integration

The component automatically handles:

- Creating posts via `useCreatePost` hook
- Updating posts via `useUpdatePost` hook
- File uploads via `UploadManyFiles`
- Navigation after successful operations
- Toast notifications for success/error states
