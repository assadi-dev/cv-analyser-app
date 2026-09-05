"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import {
  profilSchema,
  PROFIL_DEFAULTS,
  type ProfilFormValues,
} from "../../../_lib/profil.schema"
import { ProfilAvatar } from "../../Profil/ProfilAvatar"
import type { User } from "@/types"

interface ProfilFormProps {
  profil: User | undefined
  onSubmit: (values: ProfilFormValues) => void
  isPending: boolean
}

export function ProfilForm({ profil, onSubmit, isPending }: ProfilFormProps) {
  const form = useForm<ProfilFormValues>({
    resolver: zodResolver(profilSchema),
    defaultValues: PROFIL_DEFAULTS,
  })

  useEffect(() => {
    if (!profil) return
    form.reset({
      first_name: profil.first_name ?? "",
      last_name: profil.last_name ?? "",
      professional_title: profil.professional_title ?? "",
    })
  }, [profil, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <ProfilAvatar firstName={form.watch("first_name")} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  Prénom
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                  Nom
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="professional_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
                Titre professionnel
              </FormLabel>
              <FormControl>
                <Input placeholder="Ex: Développeur Full Stack" {...field} />
              </FormControl>
              <FormMessage className="text-[11px]" />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" size="md" loading={isPending}>
            Sauvegarder
          </Button>
        </div>
      </form>
    </Form>
  )
}
