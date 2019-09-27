<?php

namespace Stipic\EasyMenuBundle\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

class Menu
{
    private $id;

    private $name;

    private $description;

    private $createdAt;

    private $menuColumns;

    public function __construct()
    {
        $this->menuColumns = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * @return Collection|MenuColumn[]
     */
    public function getMenuColumns(): Collection
    {
        return $this->menuColumns;
    }

    public function addMenuColumn(MenuColumn $menuColumn): self
    {
        if (!$this->menuColumns->contains($menuColumn)) {
            $this->menuColumns[] = $menuColumn;
            $menuColumn->setMenu($this);
        }

        return $this;
    }

    public function removeMenuColumn(MenuColumn $menuColumn): self
    {
        if ($this->menuColumns->contains($menuColumn)) {
            $this->menuColumns->removeElement($menuColumn);
            // set the owning side to null (unless already changed)
            if ($menuColumn->getMenu() === $this) {
                $menuColumn->setMenu(null);
            }
        }

        return $this;
    }
}
