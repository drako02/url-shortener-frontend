// "use client";

// import { URL_SERVICE_API_BASE_URL } from "@/app/api/helpers";
// import { getShortUrls } from "@/app/api/urls/urls";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { useAuth } from "@/context/Auth";
// // import { TableLoader } from "@/mycomponents/loaders/table";
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import {
//   ChevronDown,
//   ChevronUp,
//   Copy,
//   ExternalLink,
//   Search,
//   Share2,
//   X,
//   AlertCircle,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { toast } from "sonner";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip";
// import { cn } from "@/lib/utils";
// import { Skeleton } from "@/components/ui/skeleton";
// import { motion, createRendererMotionComponent, compon } from "framer-motion";
// import { useUrls } from "@/context/Urls";
// import { CustomPagination } from "@/mycomponents/pagination";
// import { TableSkeleton } from "@/mycomponents/loaders/table";

// // Extend URL type with potential analytics data
// type UrlData = {
//   id: number;
//   short_code: string;
//   long_url: string;
//   created_at: string;
//   updated_at: string;
//   user_id: number;
//   visits?: number;
// };

// // Loading skeleton for the table


// // Empty state component
// const EmptyState = () => (
//   <Card className="w-full max-w-3xl mx-auto mt-8 border-dashed">
//     <CardHeader className="text-center">
//       <CardTitle>No URLs Yet</CardTitle>
//       <CardDescription>
//         You haven&apos;t created any shortened URLs yet.
//       </CardDescription>
//     </CardHeader>
//     <CardContent className="flex flex-col items-center pb-6">
//       <AlertCircle className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
//       <Button asChild variant="default" className="mt-4">
//         <a href="/home">Create Your First Shortened URL</a>
//       </Button>
//     </CardContent>
//   </Card>
// );

// const UserUrlsPage = () => {
//   const { urls: providerUrls, updateUrls, allUrlsTotal } = useUrls();
//   const { user } = useAuth();
  
//   const [offset, setOffset] = useState<number>(0);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [sortConfig, setSortConfig] = useState<{
//     key: keyof UrlData | null;
//     direction: "asc" | "desc" | null;
//   }>({ key: null, direction: null });

//   const limit = 10;
  
//   // Use memoized values instead of local state
//   const currentPageUrls = useMemo(() => 
//     providerUrls.slice(offset, offset + limit),
//     [providerUrls, offset, limit]
//   );
  
//   // Filter and sort directly from the currentPageUrls
//   const filteredUrls = useMemo(() => {
//     if (!searchTerm.trim()) {
//       return currentPageUrls;
//     }
    
//     const lowercasedTerm = searchTerm.toLowerCase();
//     return currentPageUrls.filter(
//       (url) =>
//         url.long_url.toLowerCase().includes(lowercasedTerm) ||
//         url.short_code.toLowerCase().includes(lowercasedTerm)
//     );
//   }, [currentPageUrls, searchTerm]);

//   const fetchUrls = useCallback(async () => {
//     if (!user?.uid) return;
//     try {
//       setLoading(true);
      
//       // Check if we have the data for the current page
//       const hasDataForCurrentPage = providerUrls.length > offset;
      
//       // If we're on a page we don't have data for, fetch it
//       if (!hasDataForCurrentPage) {
//         // This tells the context to fetch the next batch of URLs
//         await updateUrls(limit, offset);
//       }
      
//       // If we somehow ended up with no data despite trying to fetch
//       if (offset > 0 && providerUrls.length === 0) {
//         // Go back to first page as fallback
//         setOffset(0);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load URLs");
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.uid, offset, providerUrls.length, updateUrls, limit]);

//   useEffect(() => {
//     fetchUrls();
//   }, [fetchUrls, offset]);

//   // Handle pagination
//   // const handleOffset = (dir: "next" | "previous") => {
//   //   if (dir === "next" && offset + limit < urlCount) {
//   //     setOffset(offset + limit);
//   //   } else if (dir === "previous") {
//   //     setOffset(Math.max(0, offset - limit));
//   //   }
//   // };

//   const handlePageChangeAction = (page: number) => {
//     setOffset((page - 1) * limit);
//   };

//   // Copy URL to clipboard
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard
//       .writeText(text)
//       .then(() => toast.success("URL copied to clipboard"))
//       .catch(() => toast.error("Failed to copy URL"));
//   };

//   // Share URL
//   const shareUrl = (url: string, title: string) => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: "Check out this link",
//           text: title,
//           url: url,
//         })
//         .catch(() => {
//           // Fallback if share fails
//           copyToClipboard(url);
//         });
//     } else {
//       // Fallback for browsers that don't support sharing
//       copyToClipboard(url);
//     }
//   };

//   // Handle sorting
//   const handleSort = (key: keyof UrlData) => {
//     let direction: "asc" | "desc" | null = "asc";

//     if (sortConfig.key === key) {
//       if (sortConfig.direction === "asc") {
//         direction = "desc";
//       } else if (sortConfig.direction === "desc") {
//         direction = null;
//       }
//     }

//     setSortConfig({ key, direction });
//   };
  
//   // Add this useMemo to handle sorting
//   const sortedUrls = useMemo(() => {
//     if (!sortConfig.key || !sortConfig.direction) {
//       return filteredUrls;
//     }
    
//     const key = sortConfig.key;
//     const direction = sortConfig.direction;
    
//     return [...filteredUrls].sort((a, b) => {
//       if (key === "created_at" || key === "updated_at") {
//         const aTime = new Date(a[key]).getTime() || 0;
//         const bTime = new Date(b[key]).getTime() || 0;

//         if (direction === "asc") {
//           return aTime - bTime;
//         }
//         return bTime - aTime;
//       }

//       const aValue = a[key] ?? "";
//       const bValue = b[key] ?? "";

//       if (aValue < bValue) return direction === "asc" ? -1 : 1;
//       if (aValue > bValue) return direction === "asc" ? 1 : -1;
//       return 0;
//     });
//   }, [filteredUrls, sortConfig]);

//   const AnimatedTableRow = motion(TableRow);

//   const getSortIcon = (key: keyof UrlData) => {
//     if (sortConfig.key !== key) {
//       return <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-30" />;
//     }

//     if (sortConfig.direction === "asc") {
//       return <ChevronUp className="ml-2 h-4 w-4" />;
//     }

//     if (sortConfig.direction === "desc") {
//       return <ChevronDown className="ml-2 h-4 w-4" />;
//     }

//     return <div className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-30" />;
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="container mx-auto p-4 space-y-4 animate-in fade-in duration-500">
//         <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>
//         <div className="h-10 w-full max-w-md opacity-50">
//           <Skeleton className="h-full w-full rounded-md" />
//         </div>
//         <TableSkeleton />
//       </div>
//     );
//   }

//   // Render empty state
//   if (!currentPageUrls.length) {
//     return <EmptyState />;
//   }

//   // Table header columns
//   const tableHeaderList = [
//     { key: "id" as keyof UrlData, label: "ID" },
//     { key: "short_code" as keyof UrlData, label: "Short URL" },
//     { key: "long_url" as keyof UrlData, label: "Long URL" },
//     { key: "created_at" as keyof UrlData, label: "Created At" },
//     { key: "visits" as keyof UrlData, label: "Visits" },
//   ];

//   return (
//     <div className="container mx-auto p-6 space-y-6 animate-in fade-in duration-300 max-w-7xl">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//         <h1 className="text-3xl font-bold tracking-tight">My URLs</h1>

//         <div className="relative w-full md:w-auto max-w-sm">
//           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//           <Input
//             type="search"
//             placeholder="Search URLs..."
//             className="pl-9 pr-9 w-full"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           {searchTerm && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="absolute right-1 top-1 h-8 w-8 p-0"
//               onClick={() => setSearchTerm("")}
//             >
//               <X className="h-4 w-4" />
//               <span className="sr-only">Clear search</span>
//             </Button>
//           )}
//         </div>
//       </div>

//       <Card className="overflow-hidden border rounded-lg shadow-sm">
//         <div className="overflow-x-auto">
//           <Table>
//             <TableCaption className="pb-2">
//               {filteredUrls.length === currentPageUrls.length
//                 ? `Showing ${Math.min(offset + 1, allUrlsTotal)} to ${Math.min(
//                     offset + filteredUrls.length,
//                     allUrlsTotal
//                   )} of ${allUrlsTotal} URLs`
//                 : `Filtered: ${filteredUrls.length} results`}
//             </TableCaption>
//             <TableHeader>
//               <TableRow>
//                 {tableHeaderList.map((header) => (
//                   <TableHead
//                     key={String(header.key)}
//                     className="group cursor-pointer hover:text-foreground transition-colors"
//                     onClick={() => handleSort(header.key)}
//                   >
//                     <div className="flex items-center">
//                       {header.label}
//                       {getSortIcon(header.key)}
//                     </div>
//                   </TableHead>
//                 ))}
//                 <TableHead className="w-[100px] text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {sortedUrls.map((url, index) => (
//                 <AnimatedTableRow
//                   key={url.id}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.2, delay: index * 0.05 }}
//                   className="group"
//                 >
//                   <TableCell className="font-medium">#{url.id}</TableCell>
//                   <TableCell>
//                     <div className="flex items-center gap-2 max-w-[250px]">
//                       <span className="truncate font-mono text-sm text-primary">
//                         {`${URL_SERVICE_API_BASE_URL}/${url.short_code}`}
//                       </span>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                               onClick={() =>
//                                 copyToClipboard(
//                                   `${URL_SERVICE_API_BASE_URL}/${url.short_code}`
//                                 )
//                               }
//                             >
//                               <Copy className="h-4 w-4" />
//                               <span className="sr-only">Copy URL</span>
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>Copy to clipboard</TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
//                               asChild
//                             >
//                               <a
//                                 href={`${URL_SERVICE_API_BASE_URL}/${url.short_code}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                               >
//                                 <ExternalLink className="h-4 w-4" />
//                                 <span className="sr-only">Open URL</span>
//                               </a>
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>Visit link</TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </TableCell>
//                   <TableCell className="max-w-[300px]">
//                     <div className=" hover:z-10 w-full truncate">
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger>
//                             <a
//                               href={url.long_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors"
//                             >
//                               {url.long_url}
//                             </a>
//                           </TooltipTrigger>
//                           <TooltipContent
//                             side="top"
//                             align="start"
//                             className="break-all"
//                           >
//                             {url.long_url}
//                           </TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </TableCell>
//                   <TableCell>
//                     <span className="whitespace-nowrap">
//                       {new Date(url.created_at).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "short",
//                         day: "numeric",
//                       })}
//                     </span>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {new Date(url.created_at).toLocaleTimeString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </p>
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={(url.visits ?? 0) > 50 ? "default" : "outline"}
//                       className={cn(
//                         "whitespace-nowrap",
//                         (url.visits ?? 0) > 50
//                           ? "bg-primary"
//                           : "border-primary/20"
//                       )}
//                     >
//                       {url.visits} views
//                     </Badge>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <div className="flex items-center justify-end gap-2">
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="h-8 w-8 p-0"
//                               onClick={() =>
//                                 shareUrl(
//                                   `${URL_SERVICE_API_BASE_URL}/${url.short_code}`,
//                                   "Shortened URL"
//                                 )
//                               }
//                             >
//                               <Share2 className="h-4 w-4" />
//                               <span className="sr-only">Share URL</span>
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>Share URL</TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
//                     </div>
//                   </TableCell>
//                 </AnimatedTableRow>
//               ))}
//               {filteredUrls.length > 0 &&
//                 filteredUrls.length < limit &&
//                 Array(limit - filteredUrls.length)
//                   .fill(0)
//                   .map((_, index) => (
//                     <TableRow key={`empty-${index}`} className="h-[52px]">
//                       <TableCell
//                         colSpan={6}
//                         className="text-center text-muted-foreground/50"
//                       >
//                         {index === 0 && filteredUrls.length === 0
//                           ? "No matching URLs found"
//                           : ""}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//             </TableBody>
//             <TableFooter className="border-t">
//               <TableRow>
//                 <TableCell colSpan={6} className="p-2">
//                   <CustomPagination
//                     currentPage={Math.floor(offset / limit) + 1}
//                     totalPages={Math.ceil(allUrlsTotal / limit)}
//                     limit={limit}
//                     onPageChangeAction={handlePageChangeAction}
//                     className="flex justify-center"
//                   />
//                 </TableCell>
//               </TableRow>
//             </TableFooter>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default UserUrlsPage;
