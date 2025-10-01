import { TableCell, TableRow } from "./ui/table";

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i} className="border-b border-[#B6B6B633]">
                    <TableCell className="px-4 py-4">
                        <div className="w-[120px] h-[70px] bg-gray-700 animate-pulse rounded-md" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <div className="w-10 h-4 bg-gray-700 animate-pulse rounded" />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                        <div className="w-32 h-4 bg-gray-700 animate-pulse rounded mx-auto" />
                    </TableCell>
                    <TableCell className="px-4 py-4 text-center">
                        <div className="w-48 h-4 bg-gray-700 animate-pulse rounded mx-auto" />
                    </TableCell>
                    <TableCell className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                            <div className="w-8 h-8 bg-gray-700 animate-pulse rounded" />
                            <div className="w-8 h-8 bg-gray-700 animate-pulse rounded" />
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
}
