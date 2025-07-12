"use client";

import { useState, useCallback } from "react";
import { z } from "zod";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";

const csvSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(["requester", "maintenance", "admin", "super_admin"]),
  organizationId: z.string().optional(), // allow empty string → will map to null
});

type CsvRow = z.infer<typeof csvSchema>;

// Type for the server payload
type ServerPayload = {
  email: string;
  firstName: string;
  lastName: string;
  role: "requester" | "maintenance" | "admin" | "super_admin";
  organizationId?: number | null;
};

export default function BulkUserImportModal() {
  const [step, setStep] = useState<"upload" | "map" | "preview">("upload");
  const [rawColumns, setRawColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [columnMap, setColumnMap] = useState<Record<string, keyof CsvRow>>({});
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const bulkMutation = useMutation({
    mutationFn: (payload: ServerPayload[]) => {
      console.log("=== FRONTEND BULK IMPORT DEBUG ===");
      console.log("Payload being sent:", payload);
      console.log("Payload type:", typeof payload);
      console.log("Payload length:", payload.length);
      
      return fetch("http://localhost:5000/api/admin/users/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ users: payload }),
        credentials: "include",
      }).then(async (r) => {
        console.log("Response status:", r.status);
        console.log("Response ok:", r.ok);
        if (!r.ok) {
          const errorText = await r.text();
          console.error("Error response:", errorText);
          throw new Error(errorText);
        }
        const responseData = await r.json();
        console.log("Success response:", responseData);
        return responseData;
      });
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ 
        title: `Imported ${res.created} users`, 
        description: res.message || `${res.failed} failed. Check server logs for temporary passwords.` 
      });
      setIsOpen(false);
      setStep("upload");
      setRawColumns([]);
      setRows([]);
      setColumnMap({});
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Import failed", description: e.message }),
  });

  /** ---------- handlers ---------- */
  const parseCSV = (text: string): string[][] => {
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map(line => {
      // Simple CSV parsing - split by comma, handle quoted values
      const result = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      result.push(current.trim());
      return result;
    });
  };

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({ variant: "destructive", title: "Invalid file type", description: "Please upload a CSV file" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = parseCSV(text);
        
        if (data.length < 2) {
          toast({ variant: "destructive", title: "Invalid CSV", description: "CSV must have at least a header and one data row" });
          return;
        }
        
        const [header, ...body] = data;
        setRawColumns(header);
        setRows(body);
        setStep("map");
      } catch (error) {
        toast({ variant: "destructive", title: "Error parsing CSV", description: "Please check your CSV format" });
      }
    };
    reader.onerror = () => {
      toast({ variant: "destructive", title: "Error reading file", description: "Please try again" });
    };
    reader.readAsText(file);
  }, [toast]);

  const proceedToPreview = () => {
    // ensure every required field mapped
    const required: (keyof CsvRow)[] = ["email", "firstName", "lastName", "role"];
    const missing = required.filter((f) => !Object.values(columnMap).includes(f));
    if (missing.length) {
      toast({ 
        variant: "destructive", 
        title: "Mapping incomplete", 
        description: `Please map these required columns: ${missing.join(", ")}. All columns marked with * are required.` 
      });
      return;
    }
    
    try {
      // Test the mapping by trying to create mappedRows
      const testRows = rows.map((r, index) => {
        const obj: any = {};
        rawColumns.forEach((col, idx) => {
          const mapped = columnMap[col];
          if (mapped) obj[mapped] = r[idx];
        });
        const parsed = csvSchema.safeParse({ ...obj, organizationId: obj.organizationId || undefined });
        if (!parsed.success) {
          throw new Error(`Row ${index + 1}: ${parsed.error.message}`);
        }
        return parsed.data;
      });
      
      setStep("preview");
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Mapping error", 
        description: error instanceof Error ? error.message : "Invalid data in CSV" 
      });
    }
  };

  const mappedRows: ServerPayload[] =
    step === "preview"
      ? rows.map((r, index) => {
          try {
            console.log(`Processing row ${index + 1}:`, r);
            const obj: any = {};
            rawColumns.forEach((col, idx) => {
              const mapped = columnMap[col];
              if (mapped) obj[mapped] = r[idx];
            });
            console.log(`Mapped object for row ${index + 1}:`, obj);
            
            // enforce schema, convert orgId to number/null
            const parsed = csvSchema.safeParse({ ...obj, organizationId: obj.organizationId || undefined });
            if (!parsed.success) {
              console.error(`Validation failed for row ${index + 1}:`, parsed.error);
              throw new Error(`Row ${index + 1}: ${parsed.error.message}`);
            }
            
            const result = { 
              ...parsed.data, 
              organizationId: parsed.data.organizationId ? Number(parsed.data.organizationId) : null 
            };
            console.log(`Final result for row ${index + 1}:`, result);
            return result;
          } catch (error) {
            console.error(`Error processing row ${index + 1}:`, error);
            throw new Error(`Row ${index + 1}: ${error instanceof Error ? error.message : 'Invalid data'}`);
          }
        })
      : [];

  /** ---------- JSX ---------- */
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setStep("upload");
        setRawColumns([]);
        setRows([]);
        setColumnMap({});
      }
    }}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk User Import</DialogTitle>
          <DialogDescription>
            Upload a CSV, map columns, preview, and import in one go.
          </DialogDescription>
        </DialogHeader>

        {/* ---- STEP 1 Upload ---- */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <p className="font-medium mb-2">CSV File Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>email</strong> - User's email address (required)</li>
                <li><strong>firstName</strong> - User's first name (required)</li>
                <li><strong>lastName</strong> - User's last name (required)</li>
                <li><strong>role</strong> - User role: requester, maintenance, admin, or super_admin (required)</li>
                <li><strong>organizationId</strong> - Organization ID (optional, leave empty for super_admin users)</li>
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                <strong>Note:</strong> The CSV should have a header row with column names. 
                You'll be able to map these columns in the next step.
              </p>
            </div>
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
            <div className="text-xs text-gray-500">
              <a 
                href="/sample-users.csv" 
                download 
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Download sample CSV
              </a>
              <span className="ml-2">- Use this as a template for your import</span>
            </div>
          </div>
        )}

        {/* ---- STEP 2 Map columns ---- */}
        {step === "map" && (
          <div className="space-y-6">
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
              <p className="font-medium mb-2">Column Mapping Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>email*</strong> - User's email address (required)</li>
                <li><strong>firstName*</strong> - User's first name (required)</li>
                <li><strong>lastName*</strong> - User's last name (required)</li>
                <li><strong>role*</strong> - User role: requester, maintenance, admin, or super_admin (required)</li>
                <li><strong>organizationId</strong> - Organization ID (optional, leave empty for super_admin users)</li>
              </ul>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {rawColumns.map((c) => (
                    <TableHead key={c}>
                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-700">{c}</div>
                        <Select
                          value={columnMap[c] ?? ""}
                          onValueChange={(v) => setColumnMap({ ...columnMap, [c]: v as keyof CsvRow })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select field..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">email*</SelectItem>
                            <SelectItem value="firstName">firstName*</SelectItem>
                            <SelectItem value="lastName">lastName*</SelectItem>
                            <SelectItem value="role">role*</SelectItem>
                            <SelectItem value="organizationId">organizationId</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.slice(0, 3).map((r, i) => (
                  <TableRow key={i}>
                    {r.map((cell, j) => (
                      <TableCell key={j}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="space-y-4">
              {/* Mapping Status */}
              <div className="text-sm">
                <p className="font-medium mb-2">Mapping Status:</p>
                <div className="flex flex-wrap gap-2">
                  {["email", "firstName", "lastName", "role"].map((field) => {
                    const isMapped = Object.values(columnMap).includes(field as keyof CsvRow);
                    return (
                      <div
                        key={field}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isMapped 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {field} {isMapped ? "✓" : "✗"}
                      </div>
                    );
                  })}
                  <div className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    organizationId (optional)
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  Back
                </Button>
                <Button 
                  onClick={proceedToPreview}
                  disabled={!["email", "firstName", "lastName", "role"].every(field => 
                    Object.values(columnMap).includes(field as keyof CsvRow)
                  )}
                >
                  Preview
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ---- STEP 3 Preview & Import ---- */}
        {step === "preview" && (
          <div className="space-y-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Org</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappedRows.slice(0, 10).map((u, i) => (
                  <TableRow key={i}>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.firstName} {u.lastName}
                    </TableCell>
                    <TableCell>{u.role}</TableCell>
                    <TableCell>{u.organizationId ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setStep("map")}>
                Back
              </Button>
              <Button
                onClick={() => {
                  console.log("=== PREVIEW STEP DEBUG ===");
                  console.log("About to import mappedRows:", mappedRows);
                  console.log("mappedRows length:", mappedRows.length);
                  console.log("mappedRows type:", typeof mappedRows);
                  bulkMutation.mutate(mappedRows);
                }}
                disabled={bulkMutation.isPending}
              >
                {bulkMutation.isPending ? "Importing..." : `Import ${mappedRows.length} Users`}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
