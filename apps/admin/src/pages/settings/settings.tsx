import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Globe, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sidebar, SidebarLayout } from "@/components/ui/sidebar";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createDomain, fetchDomains, verifyDomain } from "@/store/domain-slice";

function Settings() {
  const dispatch = useAppDispatch();
  const { domains, status, error } = useAppSelector((state) => state.domains);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(fetchDomains());
  }, [dispatch]);

  async function handleAddDomain(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await dispatch(createDomain(domain)).unwrap();
      setDomain("");
      setIsAddOpen(false);
      setSuccessMessage(
        "Domain added. Add the SES verification record to DNS.",
      );
    } catch (requestError) {
      console.error("Domain creation failed", requestError);
      setSuccessMessage(null);
    }
  }

  async function handleVerifyDomain(id: string) {
    try {
      await dispatch(verifyDomain(id)).unwrap();
      setSuccessMessage("Domain verification status updated.");
    } catch (requestError) {
      console.error("Domain verification failed", requestError);
      setSuccessMessage(null);
    }
  }

  return (
    <SidebarLayout>
      <Sidebar activeItem="Settings" />
      <main className="min-w-0 flex-1 pt-16 md:h-svh md:overflow-y-auto md:pt-0">
        <div className="mx-auto max-w-5xl p-5 sm:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm text-muted-foreground">Settings</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Domains
              </h1>
              <p className="mt-1 text-muted-foreground">
                Configure domains for sending Publish.com emails.
              </p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4" />
                  Add domain
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form className="space-y-4" onSubmit={handleAddDomain}>
                  <div>
                    <DialogTitle className="font-semibold">
                      Add a domain
                    </DialogTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      SES will provide a DNS record for verification.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Input
                      id="domain"
                      placeholder="example.com"
                      value={domain}
                      onChange={(event) => setDomain(event.target.value)}
                      required
                    />
                  </div>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={status === "loading"}
                  >
                    Add domain
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </header>

          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          {successMessage && (
            <p className="mb-4 text-sm text-emerald-600" role="status">
              {successMessage}
            </p>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configured domains</CardTitle>
              <p className="text-sm text-muted-foreground">
                {domains.length} domains configured
              </p>
            </CardHeader>
            <CardContent>
              {status === "loading" && domains.length === 0 ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                  Loading domains...
                </p>
              ) : domains.length === 0 ? (
                <div className="py-12 text-center">
                  <Globe className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    No domains configured yet.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {domains.map((item) => {
                    const verified = item.status === "Success";
                    return (
                      <div
                        className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                        key={item._id}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                            <Globe className="size-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">{item.domain}</p>
                            <p className="text-xs text-muted-foreground">
                              SES identity
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-sm ${
                              verified ? "text-emerald-600" : "text-amber-600"
                            }`}
                          >
                            {verified ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              <RefreshCw className="size-4" />
                            )}
                            {item.status}
                          </span>
                          {!verified && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={status === "loading"}
                              onClick={() => void handleVerifyDomain(item._id)}
                            >
                              Check status
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </SidebarLayout>
  );
}

export default Settings;
