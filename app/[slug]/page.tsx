"use client";

import { useEffect, useState } from "react";
import TemplateOne from "./templates/template1";
import TemplateTwo from "./templates/template2";
import TemplateThree from "./templates/template3";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/supabase/client";
import { getTenant } from "@/queries/tenantInfo";
import Loader from "@/components/loader";
import { getCategories } from "@/queries/categories";
import { getItems } from "@/queries/items";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  desc: string;
  image_url: string;
  popular?: boolean;
  categoryId: number;
  quantity?: number;
  availability: boolean;
};

type MenuCategory = {
  id: number;
  name: string;
  items: MenuItem[];
};

export default function ClientPage() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [templateId, setTemplateId] = useState(1);
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const params = useParams();
  const slug = params?.slug as string;

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const handleRestaboardData = async () => {
      setLoading(true);
      const tenant = await getTenant(slug);

      if (tenant.code === 0) {
        console.log("failed to fetch tenant: ", tenant.message);
        return;
      } else {
        console.log(tenant.data);
        setTenant(tenant.data);
        setTemplateId(tenant.data.templateId)
      }

      const resCat = await getCategories(tenant.data.id);
      if (resCat.code === 0) {
        console.error("Failed to fetch categories:", resCat.message);
        setLoading(false);
        return;
      }

      const categoryData = resCat.data;

      const categoriesWithItems: MenuCategory[] = await Promise.all(
        (categoryData ?? []).map(async (cat: any) => {
          const resItems = await getItems(tenant.data.id, cat.id);
          const safeItems =
            resItems.code === 1 && Array.isArray(resItems.data)
              ? resItems.data
              : [];

          return {
            id: cat.id,
            name: cat.name,
            items: safeItems.map((item: any) => ({
              id: item.id,
              name: item.name,
              price: item.price,
              desc: item.desc,
              image_url: item.image_url,
              categoryId: cat.id,
              availability: item.availability ?? true, // Default to true if undefined
            })),
          };
        })
      );

      setMenu(categoriesWithItems);
      console.log(categoriesWithItems);
      setLoading(false);
    };

    handleRestaboardData();
  }, [slug, router, supabase]);
  
  // const templateId = 1; // Change this to 1, 2, or 3 to switch templates

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen">
      {/* {templateId === 1 ? (
        <TemplateOne tenant={tenant} menu={menu} />
      ) : templateId === 2 ? (
        <TemplateTwo tenant={tenant} menu={menu} />
      ) : (
        <TemplateThree tenant={tenant} menu={menu} />
      )} */}
      <TemplateOne tenant={tenant} menu={menu} />
    </main>
  );
}
